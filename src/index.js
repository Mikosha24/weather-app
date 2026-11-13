import "./style.css";
import { getWeather } from "./app.js";

async function test(location) {
	try {
		const data = await getWeather(location);
		console.log(data);
	} catch (error) {
		console.log(error.message);
	}
}

test("   ");
