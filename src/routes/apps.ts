import * as Express from "express";
import { asyncQuery, getFormattedDate } from "../util";
import { getConnectedUserInfo } from "./auth";
import { APIUser } from "discord-api-types";

export const appsRouter = Express.Router();

appsRouter.get("/:identifier/", async (req, res) => {
	let identifier = req.params.identifier;

	try {
		// Selects the timestamp of the first message, in each of
		// the applicant's tickets.
		let timestamps = await asyncQuery(
			"SELECT FROM_UNIXTIME(date, '%d/%m/%Y') FROM apps WHERE username = ?",
			[ identifier ]);
		let user: APIUser | undefined = await getConnectedUserInfo(req.cookies.token);

		// If the person has applied more than once and there are no
		// queries for which round to get, it will send a page with the
		// list of links to all of their tickets.
		// If there is a 'round' specified it will get that one.
		// Otherwise, it will redirect to their first (and only) ticket.
		if (timestamps.length > 1 && !req.query.round) {
			res.render("apps/rounds", { name: identifier, tickets: timestamps });
		} else if (req.query.round) {
			let messages;
			let round: number = req.query.round ? parseInt(req.query.round as string) : 0;
			messages = await createMessagesList(identifier, round);

			res.render("apps/channel", { messages: messages, auth: user });
		} else {
			res.redirect("?round=0");
		}
	} catch (e) {
		console.log(e);
		res.status(404).send("404: Unable to find application.");
	}
});

appsRouter.get("/", async (req, res) => {
	res.render("apps/home", {
		auth: await getConnectedUserInfo(req.cookies.token as string),
		applications: await getApplicants()
	});
});

async function createMessagesList(identifier: string, round: number) {
	let messages = await asyncQuery(
		"SELECT messages FROM apps WHERE username = ? AND round = ?",
		[ identifier, round ]);
	messages = JSON.parse(messages[0].messages);
	return messages;
}

async function getApplicants() {
	let archived = [];
	for (let ticket of await asyncQuery("SELECT * FROM apps;")) {
		archived.push({
			status: ticket.status,
			link: ticket.messages ? `/apps/${ticket.username}?round=${ticket.round}` : "#",
			pfp: ticket.avatar || "/assets/images/default-avatar.png",
			name: ticket.username,
			discriminator: ticket.discriminator,
			date: getFormattedDate(ticket.date),
			round: ticket.round
		});
	}

	return archived.reverse();
}