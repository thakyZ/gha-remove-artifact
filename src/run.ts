import * as core from "@actions/core";

export default async function run() {
	// Parse input parameters
	let nameFilter: RegExp | undefined;
	if (core.getInput("filter-name") !== "") {
		nameFilter = new RegExp(core.getInput("filter-name"));
	}
	let maxCount: number | undefined;
	if (core.getInput("max-count") !== "") {
		maxCount = parseInt(core.getInput("max-count"), 10);
	}
	let maxAge: number | undefined;
	if (core.getInput("max-age") !== "") {
		maxAge = parseInt(core.getInput("max-age"), 10);
	}

	// Stop if parameter is invalid
	if (maxCount != null && isNaN(maxCount)) {
		throw new Error("Input for max-count is not a valid number");
	}
	if (maxAge != null && isNaN(maxAge)) {
		throw new Error("Input for max-age is not a valid number");
	}

	/* eslint-disable no-console */
	console.log("Filtering with:");
	if (nameFilter == null && maxCount == null && maxAge == null) {
		console.log("  Nothing");
	}
	if (nameFilter != null) {
		console.log("  Name filter   - " + nameFilter.toString());
	}
	if (maxCount != null) {
		console.log("  Maximum count - " + maxCount.toString());
	}
	if (maxAge != null) {
		const day = Math.floor(maxAge / (60 * 60 * 24));
		const hour = Math.floor(maxAge / (60 * 60)) % 24;
		const minute = Math.floor(maxAge / 60) % 60;
		const second = maxAge % 60;
		console.log(`  Maximum age   - ${day}d ${hour}h ${minute}m ${second}s`);
	}
	/* eslint-enable no-console */
}
