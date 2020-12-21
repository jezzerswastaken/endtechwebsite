import { db } from "./index";

export function toBase64(s: string) {
	return Buffer.from(s, "binary").toString("base64");
}

export function asyncQuery(query: string, params: Array<any> = []):
	Promise<any> {

	return new Promise((resolve, reject) => {
		db.query(query, params, (err, results) => {
			if (err) reject(err);
			else resolve(results);
		});
	});
}

export function getFormattedDate(time: number) {
	let date = new Date(time);
	let year = date.getFullYear();

	let month = (1 + date.getMonth()).toString();
	month = month.length > 1 ? month : "0" + month;

	let day = date.getDate().toString();
	day = day.length > 1 ? day : "0" + day;

	return day + "/" + month + "/" + year;
}