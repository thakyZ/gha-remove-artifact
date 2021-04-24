import * as core from "@actions/core";
import * as github from "@actions/github";
import {GitHub} from "@actions/github/lib/utils";
import {throttling} from "@octokit/plugin-throttling";
import dayjs from "dayjs";

GitHub.plugin(throttling);

export default async function run() {
	const now = dayjs();

	// Parse input parameters
	let nameFilter: RegExp | string | undefined;
	if (core.getInput("only-name") !== "") {
		nameFilter = core.getInput("only-name");
	} else if (core.getInput("regex-name") !== "") {
		nameFilter = new RegExp(core.getInput("regex-name"));
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
	if (core.getInput("GITHUB_TOKEN") === "") {
		throw new Error("GITHUB_TOKEN is empty");
	}
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
		if (nameFilter instanceof RegExp) {
			console.log("  Name(regex)   - " + nameFilter.toString());
		} else {
			console.log("  Name(exact)   - " + nameFilter);
		}
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

	const octokit = github.getOctokit(core.getInput("GITHUB_TOKEN"), {
		onRateLimit: (retryAfter: number, options: any) => {
			octokit.log.warn(
				`Request quota exhausted for request ${options.method} ${options.url}`
			);

			// Retry twice after hitting a rate limit error, then give up
			if (options.request.retryCount <= 2) {
				console.log(`Retrying after ${retryAfter} seconds!`);
				return true;
			}
		},
		onAbuseLimit: (_retryAfter: number, options: any) => {
			// does not retry, only logs a warning
			octokit.log.warn(`Abuse detected for request ${options.method} ${options.url}`);
		},
	});

	// Read all artifacts
	const artifactList = await octokit.paginate(
		octokit.actions.listArtifactsForRepo,
		github.context.repo
	);

	// Filter artifacts by rules
	const filtered: typeof artifactList.artifacts = [];
	for (const artifact of artifactList) {
		if (artifact.expired) {
			continue;
		}

		if (nameFilter != null) {
			if (nameFilter instanceof RegExp && !nameFilter.test(artifact.name)) {
				continue;
			}
			if (typeof nameFilter === "string" && artifact.name !== nameFilter) {
				continue;
			}
		}

		filtered.push(artifact);
	}

	// Filter artifact by age
	const truncated: typeof filtered = [];
	for (const artifact of filtered) {
		if (maxAge != null && now.unix() - dayjs(artifact.created_at).unix() > maxAge) {
			continue;
		}

		truncated.push(artifact);
	}

	// Sort artifacts by created_at
	const mapped = truncated.map(a => ({...a, created_at: dayjs(a.created_at)}));
	mapped.sort((a, b) => b.created_at.valueOf() - a.created_at.valueOf());

	// Truncate by max-count
	const result = mapped.slice(0, maxCount);

	// Remove all target artifacts
	const idSet = new Set(result.map(a => a.id));
	for (const artifact of filtered) {
		if (!idSet.has(artifact.id)) {
			console.log(`Deleting artifact ${artifact.name} (#${artifact.id})`);
			await octokit.actions.deleteArtifact({
				...github.context.repo,
				artifact_id: artifact.id
			});
		} else {
			console.log(`Keeping artifact ${artifact.name} (#${artifact.id})`);
		}
	}
}
