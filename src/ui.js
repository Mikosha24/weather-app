import { toCelsius } from "./units.js";

const weatherEl = document.querySelector("#weather");
const placeEl = document.querySelector("#place");
const tempEl = document.querySelector("#temp");
const conditionsEl = document.querySelector("#conditions");
const forecastEl = document.querySelector("#forecast");
const unitToggle = document.querySelector("#unit-toggle");

const ICONS = {
	"clear-day": "☀️",
	"clear-night": "🌙",
	"partly-cloudy-day": "⛅",
	"partly-cloudy-night": "☁️",
	cloudy: "☁️",
	rain: "🌧️",
	"showers-day": "🌦️",
	"showers-night": "🌧️",
	"thunder-rain": "⛈️",
	"thunder-showers-day": "⛈️",
	"thunder-showers-night": "⛈️",
	snow: "❄️",
	"snow-showers-day": "🌨️",
	"snow-showers-night": "🌨️",
	fog: "🌫️",
	wind: "💨",
};

function getIcon(name) {
	return ICONS[name] ?? "🌡️";
}

// Groups the API's icon names into the few themes the CSS knows about
function getTheme(icon) {
	if (icon.includes("thunder")) return "storm";
	if (icon.includes("snow")) return "snow";
	if (icon.includes("rain") || icon.includes("showers")) return "rain";
	if (icon === "fog") return "fog";
	if (icon.includes("cloudy")) return "cloudy";
	return "clear";
}

function formatTemp(fahrenheit, unit) {
	const value = unit === "C" ? toCelsius(fahrenheit) : fahrenheit;
	return `${Math.round(value)}°${unit}`;
}

// "2026-11-13" -> "Fri". Built from parts so it's local time, not UTC
function dayLabel(dateString) {
	const [year, month, day] = dateString.split("-").map(Number);
	return new Date(year, month - 1, day).toLocaleDateString("en-US", {
		weekday: "short",
	});
}

export function renderWeather(weather, unit) {
	placeEl.textContent = weather.place;
	tempEl.textContent = formatTemp(weather.temp, unit);
	conditionsEl.textContent = `${getIcon(weather.conditionsIcon)} ${weather.conditions}`;

	const items = weather.days.map((day) => {
		const li = document.createElement("li");
		li.textContent = `${dayLabel(day.date)} ${getIcon(day.conditionsIcon)} ${formatTemp(day.high, unit)} / ${formatTemp(day.low, unit)}`;
		return li;
	});
	forecastEl.replaceChildren(...items);

	unitToggle.textContent = unit === "F" ? "Switch to °C" : "Switch to °F";

	document.body.dataset.theme = getTheme(weather.conditionsIcon);
	document.body.dataset.night = String(
		weather.conditionsIcon.endsWith("night"),
	);

	weatherEl.hidden = false;
}
