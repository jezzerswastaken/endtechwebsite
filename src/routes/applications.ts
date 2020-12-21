import * as Express from "express";

export const appsRouter = Express.Router();

appsRouter.get("/:identifier/", () => undefined);
appsRouter.get("/", () => undefined);