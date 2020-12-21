import * as Express from "express";
import { appsRouter } from "./apps";
import { authRouter } from "./auth";
import { publicRouter } from "./public";
import { membersRouter } from "./members";
import { projectsRouter } from "./projects";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser"
import { isAuthenticated } from "./auth";

export const router = Express.Router();

router.use(bodyParser.json());
router.use(cookieParser());

router.use("/", Express.static("public/"));
router.use("/", publicRouter);
router.use("/auth", authRouter);
router.use("/members", privatise(membersRouter));
router.use("/apps", privatise(appsRouter));
router.use("/projects", privatise(projectsRouter));

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
