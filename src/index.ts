import * as core from "@actions/core";

import run from "./run";

async function main() {
	try {
		await run();
	} catch (e) {
		core.setFailed(e.message);
	}
}

main();
