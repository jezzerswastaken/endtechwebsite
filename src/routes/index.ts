import * as Express from "express";
import { appsRouter } from "./applications";
import { authRouter } from "./auth";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser"
import { isAuthenticated } from "../auth";

export const router = Express.Router();

router.use(bodyParser.json());
router.use(cookieParser());

router.use("/", Express.static("public/"));
router.use("/auth", authRouter);
router.use("/apps", privatise(appsRouter));

function privatise(router: Express.Router): Express.Router {
	const privateRouter = Express.Router();
	privateRouter.use(async (req, res, next) => {
		if (await isAuthenticated(req.cookies.token)) {
			next();
		} else {
			res.redirect("/auth");
		}
	});
	privateRouter.use(router);
	return privateRouter;
}
