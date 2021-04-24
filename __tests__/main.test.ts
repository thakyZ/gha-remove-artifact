import run from "../src/run";

test("should throw an error if max-count is not a number", async () => {
	process.env["INPUT_FILTER-NAME"] = "";
	process.env["INPUT_MAX-COUNT"] = "foo";
	process.env["INPUT_MAX-AGE"] = "";

	await expect(run()).rejects.toThrow();
});

test("should throw an error if max-age is not a number", async () => {
	process.env["INPUT_FILTER-NAME"] = "";
	process.env["INPUT_MAX-COUNT"] = "";
	process.env["INPUT_MAX-AGE"] = "foo";

	await expect(run()).rejects.toThrow();
});
