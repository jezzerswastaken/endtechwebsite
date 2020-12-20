import { config } from "dotenv";
import * as Express from "express";
import { router } from "./routes";

config();

export const app = Express();

app.use(router);
app.listen(process.env.PORT || 8080, () => {
	console.log(`Server listening to port ${process.env.PORT || 8080}`);
});