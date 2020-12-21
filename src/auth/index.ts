import { getUserInfo, getUserToken } from "./discord";

type Req = any;
type Res = any;

export function getAuth(req: Req, res: Res) {
	res.redirect(process.env.OAUTH2_URL);
}

export async function onOauthCallback(req: Req, res: Res) {
	let { access_token: token } = await getUserToken(req.query.code);
	let info = await getUserInfo(token);
	res.redirect("/");
}