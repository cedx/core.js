/* eslint-disable max-lines-per-function */
import {Sort, SortDirection} from "@cedx/core/Web/Sort.js";
import {assert} from "chai";

/**
 * Tests the features of the {@link Sort} class.
 */
describe("Sort", () => {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const {deepEqual, equal, isAbove, isBelow, isEmpty, lengthOf} = assert;

	describe("length", () => {
		const sort = new Sort;

		it("should increment when adding an entry", () => {
			lengthOf(sort, 0);
			lengthOf(sort.append("foo", SortDirection.Ascending), 1);
			lengthOf(sort.append("bar", SortDirection.Descending), 2);
		});

		it("should decrement when removing an entry", () => {
			sort.delete("foo");
			lengthOf(sort, 1);
		});
	});

	describe("*[Symbol.iterator]()", () => {
		it("should end iteration immediately if the sort is empty", () => {
			const iterator = new Sort()[Symbol.iterator]();
			assert.isTrue(iterator.next().done);
		});

		it("should iterate over the entries if the sort is not empty", () => {
			const iterator = Sort.of("foo").prepend("bar", SortDirection.Descending)[Symbol.iterator]();
			let next = iterator.next();
			assert.isTrue(!next.done);
			deepEqual(next.value, ["bar", SortDirection.Descending]);
			next = iterator.next();
			assert.isFalse(next.done);
			deepEqual(next.value, ["foo", SortDirection.Ascending]);
			assert.isTrue(iterator.next().done);
		});
	});

	describe("append()", () => {
		const sort = Sort.of("foo");

		it("should append a new entry to the end", () => {
			sort.append("bar", SortDirection.Ascending);
			deepEqual(Array.from(sort), [["foo", SortDirection.Ascending], ["bar", SortDirection.Ascending]]);
		});

		it("should move an existing entry to the end and update its value", () => {
			sort.append("foo", SortDirection.Descending);
			deepEqual(Array.from(sort), [["bar", SortDirection.Ascending], ["foo", SortDirection.Descending]]);
		});
	});

	describe("at()", () => {
		const sort = Sort.of("foo");
		it("should return the entry at the specified index", () => deepEqual(sort.at(0), ["foo", SortDirection.Ascending]));
		it("should return `null` for an unknown entry", () => assert.isNull(sort.at(1)));
	});

	describe("compare()", () => {
		const x = {index: 1, name: "abc", type: "object"};
		const y = {index: 2, name: "xyz", type: "object"};

		it("should return zero if the two objects are considered equal", () => {
			equal(Sort.of("type").compare(x, y), 0);
			equal(Sort.of("type", SortDirection.Descending).compare(x, y), 0);
		});

		it("should return a negative number if the first object is before the second", () => {
			isBelow(Sort.of("index").compare(x, y), 0);
			isBelow(Sort.of("name").compare(x, y), 0);
			isBelow(new Sort([["type", SortDirection.Ascending], ["index", SortDirection.Ascending]]).compare(x, y), 0);
		});

		it("should return a positive number if the first object is after the second", () => {
			isAbove(Sort.of("index", SortDirection.Descending).compare(x, y), 0);
			isAbove(Sort.of("name", SortDirection.Descending).compare(x, y), 0);
			isAbove(new Sort([["type", SortDirection.Descending], ["index", SortDirection.Descending]]).compare(x, y), 0);
		});
	});

	describe("delete()", () => {
		it("should properly remove entries", () => {
			const sort = new Sort([["foo", SortDirection.Ascending], ["bar", SortDirection.Descending]]);
			sort.delete("foo");
			deepEqual(Array.from(sort), [["bar", SortDirection.Descending]]);
			sort.delete("bar");
			isEmpty(Array.from(sort));
		});
	});

	describe("get()", () => {
		const sort = Sort.of("foo");
		it("should return the corresponding order for an existing entry", () => equal(sort.get("foo"), SortDirection.Ascending));
		it("should return `null` for an unknown entry", () => assert.isNull(sort.get("bar")));
	});

	describe("getIcon()", () => {
		it("should return the icon corresponding to the sort order", () => {
			equal(Sort.of("foo").getIcon("foo"), "arrow_upward");
			equal(Sort.of("foo", SortDirection.Descending).getIcon("foo"), "arrow_downward");
			equal(new Sort().getIcon("foo"), "swap_vert");
		});
	});

	describe("has()", () => {
		const sort = Sort.of("foo");
		it("should return `true` an existing entry", () => assert.isTrue(sort.has("foo")));
		it("should return `false` for an unknown entry", () => assert.isFalse(sort.has("bar")));
	});

	describe("indexOf()", () => {
		const sort = new Sort([["foo", SortDirection.Ascending], ["bar", SortDirection.Descending]]);

		it("should return the index of an existing entry", () => {
			equal(sort.indexOf("foo"), 0);
			equal(sort.indexOf("bar"), 1);
		});

		it("should return `-1` for an unknown entry", () => equal(sort.indexOf("qux"), -1));
	});

	describe("parse()", () => {
		it("should return an empty sort for an empty string", () =>
			isEmpty(Array.from(Sort.parse(""))));

		it("should return an ascending order for an attribute without prefix", () =>
			deepEqual(Array.from(Sort.parse("foo")), [["foo", SortDirection.Ascending]]));

		it("should return a descending order for an attribute with a '-' prefix", () =>
			deepEqual(Array.from(Sort.parse("foo,-bar")), [["foo", SortDirection.Ascending], ["bar", SortDirection.Descending]]));
	});

	describe("prepend()", () => {
		const sort = Sort.of("foo");

		it("should prepend a new entry to the start", () => {
			sort.prepend("bar", SortDirection.Ascending);
			deepEqual(Array.from(sort), [["bar", SortDirection.Ascending], ["foo", SortDirection.Ascending]]);
		});

		it("should move an existing entry to the start and update its value", () => {
			sort.prepend("foo", SortDirection.Descending);
			deepEqual(Array.from(sort), [["foo", SortDirection.Descending], ["bar", SortDirection.Ascending]]);
		});
	});

	describe("satisfies()", () => {
		const sort = new Sort([["foo", SortDirection.Ascending], ["bar", SortDirection.Descending]]);

		it("should return `true` if there is nothing to satisfy", () => {
			assert.isTrue(sort.satisfies());
			assert.isTrue(new Sort().satisfies({attributes: ["foo"]}));
		});

		it("should return `true` if the conditions are satisfied", () =>
			assert.isTrue(sort.satisfies({attributes: ["bar", "foo"], min: 1, max: 2})));

		it("should return `false` if the conditions are not satisfied", () => {
			assert.isFalse(sort.satisfies({attributes: ["baz"]}));
			assert.isFalse(sort.satisfies({max: 1}));
		});
	});

	describe("set()", () => {
		const sort = new Sort;

		it("should append a new entry when setting an unknown attribute", () =>
			deepEqual(Array.from(sort.set("foo", SortDirection.Ascending)), [["foo", SortDirection.Ascending]]));

		it("should keep the order of entries when setting a known attribute", () =>
			deepEqual(Array.from(sort.set("bar", SortDirection.Ascending).set("foo", SortDirection.Descending)), [["foo", SortDirection.Descending], ["bar", SortDirection.Ascending]]));
	});

	describe("toSql()", () => {
		it("should return an empty string for an empty sort", () =>
			isEmpty(new Sort().toSql()));

		it("should return the attribute with an 'ASC' suffix for an ascending order", () =>
			equal(Sort.of("foo").toSql(), "foo ASC"));

		it("should return the attribute with a 'DESC' suffix for a descending order", () =>
			equal(new Sort([["foo", SortDirection.Ascending], ["bar", SortDirection.Descending]]).toSql(), "foo ASC, bar DESC"));

		it("should allow custom escaping of attributes", () => {
			const sort = new Sort([["foo", SortDirection.Ascending], ["bar", SortDirection.Descending]]);
			equal(sort.toSql((/** @type {string} */ value) => `[${value}]`), "[foo] ASC, [bar] DESC");
		});
	});

	describe("toString()", () => {
		it("should return an empty string for an empty sort", () =>
			isEmpty(String(new Sort)));

		it("should return the attribute for an ascending order", () =>
			equal(String(Sort.of("foo")), "foo"));

		it("should return the attribute with a '-' prefix for a descending order", () =>
			equal(String(new Sort([["foo", SortDirection.Ascending], ["bar", SortDirection.Descending]])), "foo,-bar"));
	});
});
