import * as Express from "express";

export const router = Express.Router();

router.use("/", Express.static("public/"));