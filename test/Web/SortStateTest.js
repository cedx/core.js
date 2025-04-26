/* eslint-disable max-lines-per-function */
import {SortDirection, SortState} from "@cedx/core/Web/SortState.js";
import {assert} from "chai";

/**
 * Tests the features of the {@link SortState} class.
 */
describe("SortState", () => {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const {deepEqual, equal, isAbove, isBelow, isEmpty, lengthOf} = assert;

	describe("length", () => {
		const sort = new SortState;

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
			const iterator = new SortState()[Symbol.iterator]();
			assert.isTrue(iterator.next().done);
		});

		it("should iterate over the entries if the sort is not empty", () => {
			const iterator = SortState.of("foo").prepend("bar", SortDirection.Descending)[Symbol.iterator]();
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
		const sort = SortState.of("foo");

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
		const sort = SortState.of("foo");
		it("should return the entry at the specified index", () => deepEqual(sort.at(0), ["foo", SortDirection.Ascending]));
		it("should return `null` for an unknown entry", () => assert.isNull(sort.at(1)));
	});

	describe("compare()", () => {
		const x = {index: 1, name: "abc", type: "object"};
		const y = {index: 2, name: "xyz", type: "object"};

		it("should return zero if the two objects are considered equal", () => {
			equal(SortState.of("type").compare(x, y), 0);
			equal(SortState.of("type", SortDirection.Descending).compare(x, y), 0);
		});

		it("should return a negative number if the first object is before the second", () => {
			isBelow(SortState.of("index").compare(x, y), 0);
			isBelow(SortState.of("name").compare(x, y), 0);
			isBelow(new SortState([["type", SortDirection.Ascending], ["index", SortDirection.Ascending]]).compare(x, y), 0);
		});

		it("should return a positive number if the first object is after the second", () => {
			isAbove(SortState.of("index", SortDirection.Descending).compare(x, y), 0);
			isAbove(SortState.of("name", SortDirection.Descending).compare(x, y), 0);
			isAbove(new SortState([["type", SortDirection.Descending], ["index", SortDirection.Descending]]).compare(x, y), 0);
		});
	});

	describe("delete()", () => {
		it("should properly remove entries", () => {
			const sort = new SortState([["foo", SortDirection.Ascending], ["bar", SortDirection.Descending]]);
			sort.delete("foo");
			deepEqual(Array.from(sort), [["bar", SortDirection.Descending]]);
			sort.delete("bar");
			isEmpty(Array.from(sort));
		});
	});

	describe("get()", () => {
		const sort = SortState.of("foo");
		it("should return the corresponding direction for an existing entry", () => equal(sort.get("foo"), SortDirection.Ascending));
		it("should return `null` for an unknown entry", () => assert.isNull(sort.get("bar")));
	});

	describe("getIcon()", () => {
		it("should return the icon corresponding to the sort direction", () => {
			equal(SortState.of("foo").getIcon("foo"), "arrow_upward");
			equal(SortState.of("foo", SortDirection.Descending).getIcon("foo"), "arrow_downward");
			equal(new SortState().getIcon("foo"), "swap_vert");
		});
	});

	describe("has()", () => {
		const sort = SortState.of("foo");
		it("should return `true` an existing entry", () => assert.isTrue(sort.has("foo")));
		it("should return `false` for an unknown entry", () => assert.isFalse(sort.has("bar")));
	});

	describe("indexOf()", () => {
		const sort = new SortState([["foo", SortDirection.Ascending], ["bar", SortDirection.Descending]]);

		it("should return the index of an existing entry", () => {
			equal(sort.indexOf("foo"), 0);
			equal(sort.indexOf("bar"), 1);
		});

		it("should return `-1` for an unknown entry", () => equal(sort.indexOf("qux"), -1));
	});

	describe("parse()", () => {
		it("should return an empty sort for an empty string", () =>
			isEmpty(Array.from(SortState.parse(""))));

		it("should return an ascending direction for a property without prefix", () =>
			deepEqual(Array.from(SortState.parse("foo")), [["foo", SortDirection.Ascending]]));

		it("should return a descending direction for a property with a '-' prefix", () =>
			deepEqual(Array.from(SortState.parse("foo,-bar")), [["foo", SortDirection.Ascending], ["bar", SortDirection.Descending]]));
	});

	describe("prepend()", () => {
		const sort = SortState.of("foo");

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
		const sort = new SortState([["foo", SortDirection.Ascending], ["bar", SortDirection.Descending]]);

		it("should return `true` if there is nothing to satisfy", () => {
			assert.isTrue(sort.satisfies());
			assert.isTrue(new SortState().satisfies({properties: ["foo"]}));
		});

		it("should return `true` if the conditions are satisfied", () =>
			assert.isTrue(sort.satisfies({properties: ["bar", "foo"], min: 1, max: 2})));

		it("should return `false` if the conditions are not satisfied", () => {
			assert.isFalse(sort.satisfies({properties: ["baz"]}));
			assert.isFalse(sort.satisfies({max: 1}));
		});
	});

	describe("set()", () => {
		const sort = new SortState;

		it("should append a new entry when setting an unknown property", () =>
			deepEqual(Array.from(sort.set("foo", SortDirection.Ascending)), [["foo", SortDirection.Ascending]]));

		it("should keep the order of entries when setting a known property", () =>
			deepEqual(Array.from(sort.set("bar", SortDirection.Ascending).set("foo", SortDirection.Descending)), [["foo", SortDirection.Descending], ["bar", SortDirection.Ascending]]));
	});

	describe("toSql()", () => {
		it("should return an empty string for an empty sort", () =>
			isEmpty(new SortState().toSql()));

		it("should return the property with an 'ASC' suffix for an ascending direction", () =>
			equal(SortState.of("foo").toSql(), "foo ASC"));

		it("should return the property with a 'DESC' suffix for a descending direction", () =>
			equal(new SortState([["foo", SortDirection.Ascending], ["bar", SortDirection.Descending]]).toSql(), "foo ASC, bar DESC"));

		it("should allow custom escaping of properties", () => {
			const sort = new SortState([["foo", SortDirection.Ascending], ["bar", SortDirection.Descending]]);
			equal(sort.toSql((/** @type {string} */ value) => `[${value}]`), "[foo] ASC, [bar] DESC");
		});
	});

	describe("toString()", () => {
		it("should return an empty string for an empty sort", () =>
			isEmpty(String(new SortState)));

		it("should return the property for an ascending direction", () =>
			equal(String(SortState.of("foo")), "foo"));

		it("should return the property with a '-' prefix for a descending direction", () =>
			equal(String(new SortState([["foo", SortDirection.Ascending], ["bar", SortDirection.Descending]])), "foo,-bar"));
	});
});
