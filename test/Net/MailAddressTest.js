import {MailAddress} from "@cedx/core/Net/MailAddress.js";
import {assert} from "chai";

/**
 * Tests the features of the {@link MailAddress} class.
 */
describe("MailAddress", () => {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const {equal} = assert;

	describe("host", () => {
		it("should return the portion after the '@' symbol", () => {
			equal(new MailAddress("Foo.Bar@Domain.TLD").host, "domain.tld");
			equal(new MailAddress("teßt@täst.de").host, "täst.de");
		});
	});

	describe("isEmpty", () => {
		it("should return `true` if the address is empty", () => {
			assert.isTrue(new MailAddress("").isEmpty);
			assert.isTrue(new MailAddress(" \r\n ").isEmpty);
		});

		it("should return `false` if the address is not empty", () => {
			assert.isFalse(new MailAddress("cedx@outlook.com").isEmpty);
		});
	});

	describe("isValid", () => {
		it("should return `false` for an invalid address", () => {
			assert.isFalse(new MailAddress("").isValid);
			assert.isFalse(new MailAddress("cedric@").isValid);
			assert.isFalse(new MailAddress("@belin.io").isValid);
		});

		it("should return `true` for a valid address", () => {
			assert.isTrue(new MailAddress("cedx@outlook.com").isValid);
			assert.isTrue(new MailAddress("foo-bar.baz-qux@foo.bar.baz.qux.tld").isValid);
		});
	});

	describe("user", () => {
		it("should return the portion before the '@' symbol", () => {
			equal(new MailAddress("Foo.Bar@Domain.TLD").user, "foo.bar");
			equal(new MailAddress("teßt@täst.de").user, "teßt");
		});
	});
});
