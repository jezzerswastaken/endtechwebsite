import * as Express from "express";
import { appsRouter } from "./applications";
import { authRouter } from "./auth";

export const router = Express.Router();

router.use("/", Express.static("public/"));
router.use("/auth", authRouter);
router.use("/apps", privatise(appsRouter));

function privatise(router: Express.Router): Express.Router {
	const privateRouter = Express.Router();
	privateRouter.use((req, res, next) => {
		if (true) {
			res.redirect("/auth");
		} else {
			next();
		}
	});
	privateRouter.use(router);
	return privateRouter;
}