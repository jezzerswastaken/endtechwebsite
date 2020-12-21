import * as Express from "express";
import { getConnectedUserInfo } from "./auth";
import { APIUser } from "discord-api-types";

export const publicRouter = Express.Router();

publicRouter.get("/", async (req, res) => {
	let userInfo: APIUser | undefined = await getConnectedUserInfo(req.cookies.token);
	res.render("home",
		{ auth: userInfo });
});