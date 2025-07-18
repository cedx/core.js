import {toDataUrl} from "@cedx/core/IO/File.js";
import {assert} from "chai";
import {platform} from "node:process";

/**
 * Tests the features of the file utilities.
 */
describe("File utilities", () => {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const {equal} = assert;

	describe("toDataUrl()", () => {
		it("should convert the specified file to a data URL", async () => {
			const base64 = `Q8OpZHJpYyBCZWxpbiA8Y2VkeEBvdXRsb29rLmNvbT4${platform == "win32" ? "NCg==" : "K"}`;
			const url = await toDataUrl("Authors.txt", "text/plain");
			equal(url.href, `data:text/plain;base64,${base64}`);
		});
	});
});
