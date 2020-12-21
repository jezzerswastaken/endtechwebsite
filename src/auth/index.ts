import { getUserInfo, getUserToken, isMember } from "./discord";
import { db } from "../index";

type Req = any;
type Res = any;

export function getAuth(req: Req, res: Res) {
	res.redirect(process.env.OAUTH2_URL);
}

export async function onOauthCallback(req: Req, res: Res) {
	let access = await getUserToken(req.query.code);
	let info = await getUserInfo(access.access_token);
	if (await isMember(info.id)) {
		db.query("REPLACE INTO archived_logged_on VALUES (?, ?, ?);",
			[ access.access_token,
				Date.now() + access.expires_in * 1000,
				JSON.stringify(info)
			]);
		res.cookie("token", access.access_token);
		console.log("endtech!");
	} else {
		res.clearCookie("token");
	}

	res.redirect("/");
}

export async function isAuthenticated(token: string) {
	return new Promise(resolve => {
		db.query("SELECT * FROM archived_logged_on WHERE token = ?;",
			[ token ],
			(err, results) => {
				if (results.length == 0) {
					resolve(false);
				} else if (results[0].expires_in <= Date.now()) {
					resolve(false);
				} else {
					resolve(true);
				}
			});
	});
}