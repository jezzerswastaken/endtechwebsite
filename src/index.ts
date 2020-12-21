import { config } from "dotenv";
import * as Express from "express";
import { router } from "./routes";
import { Client } from "discord.js";
import * as MySQL from "mysql";

config();

export const app = Express();
export const client = new Client();
export const db = MySQL.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

db.query(`CREATE TABLE IF NOT EXISTS archived_logged_on 
	(token varchar(32) PRIMARY KEY, expires_in BIGINT, info JSON);`);

client.once("ready", () => {
	console.log(`Connected to ${client.user?.username || "discord"}!`);
});
client.login(process.env.DISCORD_TOKEN);

app.set("view engine", "ejs");
app.use(router);
app.listen(process.env.PORT || 8080, () => {
	console.log(`Server listening to port ${process.env.PORT || 8080}`);
});