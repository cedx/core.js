import {RegionInfo} from "@cedx/core/Globalization/RegionInfo.js";
import {assert} from "chai";

/**
 * Tests the features of the {@link RegionInfo} class.
 */
describe("RegionInfo", () => {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const {equal} = assert;

	describe("emojiFlag", () => {
		it("should return the emoji flag", () => {
			const map = new Map([["BR", "🇧🇷"], ["DE", "🇩🇪"], ["FR", "🇫🇷"], ["IT", "🇮🇹"], ["MX", "🇲🇽"], ["US", "🇺🇸"]]);
			for (const [name, emoji] of map) equal(new RegionInfo(name).emojiFlag, emoji);
		});
	});

	describe("displayName()", () => {
		it("should return the localized display name", () => {
			const map = new Map([["de", "Frankreich"], ["en", "France"], ["es", "Francia"], ["fr", "France"], ["it", "Francia"], ["pt", "França"]]);
			const region = new RegionInfo("FR");
			for (const [name, displayName] of map) equal(region.displayName(name), displayName);
		});
	});
});
