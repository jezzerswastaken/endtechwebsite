import * as querystring from "querystring";
import fetch from "cross-fetch";
import { APIUser, RESTPostOAuth2AccessTokenResult, RESTPostOAuth2AccessTokenURIEncodedData } from "discord-api-types";
import { ParsedUrlQueryInput } from "querystring";
import { Snowflake } from "discord.js";
import { client } from "../../index";
import { toBase64 } from "../../util";

export async function getUserToken(code: string):
	Promise<RESTPostOAuth2AccessTokenResult> {

	const tokenURL = "https://discord.com/api/oauth2/token";
	const queries: RESTPostOAuth2AccessTokenURIEncodedData = {
		client_id: process.env.CLIENT_ID as string,
		client_secret: process.env.CLIENT_SECRET as string,
		grant_type: "authorization_code",
		code,
		redirect_uri: process.env.REDIRECT_URI,
		scope: "identify"
	};
	const auth = toBase64(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);

	let response = await fetch(tokenURL, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Authorization": `Basic ${auth}`,
		},
		body: querystring.stringify(queries as unknown as ParsedUrlQueryInput)
	});

	return await response.json();
}

export async function getUserInfo(token: string):
	Promise<APIUser> {

	let response = await fetch("https://discord.com/api/users/@me", {
		method: "GET",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Authorization": `Bearer ${token}`,
		},
	});
	return await response.json();
}

export async function isMember(id: Snowflake):
	Promise<boolean> {

	let guild = await client.guilds.fetch(process.env.GUILD_ID as Snowflake);
	let member = await guild.members.fetch(id);
	if (!member) return false;
	return member.roles.cache.has(process.env.MEMBER_ROLE_ID as Snowflake);
}