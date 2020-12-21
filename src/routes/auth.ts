import * as Express from "express";

export const authRouter = Express.Router();

authRouter.get("/", () => undefined);
authRouter.get("/discord/", () => undefined);
authRouter.get("/disconnect", () => undefined);