import "./style.css";
import { getWeather, processWeatherData } from "./app.js";
import { renderWeather } from "./ui.js";

const form = document.querySelector("#search-form");
const locationInput = document.querySelector("#location-input");
const errorMsg = document.querySelector("#error");
const loading = document.querySelector("#loading");

let lastWeather = null;
let unit = "F";

const unitToggle = document.querySelector("#unit-toggle");

unitToggle.addEventListener("click", () => {
	if (lastWeather === null) return;

	if (lastWeather !== null) {
		unit = unit === "F" ? "C" : "F";
		renderWeather(lastWeather, unit);
	}
});

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	errorMsg.textContent = "";
	errorMsg.hidden = true;

	const trimmedLocation = locationInput.value.trim();
	if (trimmedLocation === "") {
		errorMsg.textContent = "Please enter a location";
		errorMsg.hidden = false;
		return;
	}

	try {
		loading.hidden = false;
		const data = await getWeather(trimmedLocation);
		const myWeatherData = processWeatherData(data);
		lastWeather = myWeatherData;
		renderWeather(lastWeather, unit);
	} catch (error) {
		errorMsg.textContent = error.message;
		errorMsg.hidden = false;
		console.error(error); // for me
	} finally {
		loading.hidden = true;
	}
});
