import * as Express from "express";
import { APIUser } from "discord-api-types";
import { getConnectedUserInfo } from "../auth";

export const membersRouter = Express.Router();

membersRouter.get("/", async (req, res) => {
	let userInfo: APIUser | undefined = await getConnectedUserInfo(req.cookies.token);
	res.render("dashboard", { auth: userInfo });
});