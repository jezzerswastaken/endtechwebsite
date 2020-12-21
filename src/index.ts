import { config } from "dotenv";
import * as Express from "express";
import { router } from "./routes";
import { Client } from "discord.js";

config();

export const app = Express();

export const client = new Client();
client.once("ready", () => {
	console.log(`Connected to ${client.user?.username || "discord"}!`);
});
client.login(process.env.DISCORD_TOKEN);

app.use(router);
app.listen(process.env.PORT || 8080, () => {
	console.log(`Server listening to port ${process.env.PORT || 8080}`);
});