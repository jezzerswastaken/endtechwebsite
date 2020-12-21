import * as Express from "express";
import { getAuth, onOauthCallback } from "../auth";

export const authRouter = Express.Router();

authRouter.get("/", getAuth);
authRouter.get("/discord/", onOauthCallback);
authRouter.get("/disconnect", () => undefined);