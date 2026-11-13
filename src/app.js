import { API_KEY } from "./config.js";

export async function getWeather(location) {
	if (!location.trim()) throw new Error("Please enter a location.");

	const response = await fetch(
		`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=us&key=${API_KEY}&contentType=json`,
	);

	if (!response.ok) {
		if (response.status === 400) {
			throw new Error(
				`Couldn't find "${location}". Check the spelling or try adding a country.`,
			);
		} else if (response.status === 401) {
			throw new Error(`Please try again later. (error: ${console.error})`);
		} else {
			throw new Error(
				`Something went wrong (error: ${console.error} code: ${response.status})`,
			);
		}
	}

	return await response.json();
}

export function processWeatherData(weatherData) {
	const place = weatherData.resolvedAddress;
	const temp = weatherData.currentConditions.temp;
	const conditions = weatherData.currentConditions.conditions;
	const conditionsIcon = weatherData.currentConditions.icon;
	const days = weatherData.days.slice(0, 5).map((day) => {
		return {
			high: day.tempmax,
			low: day.tempmin,
			conditionsIcon: day.icon,
			date: day.datetime,
		};
	});

	return {
		place,
		temp,
		conditions,
		conditionsIcon,
		days,
	};
}
