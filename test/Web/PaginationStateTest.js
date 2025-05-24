import {PaginationState} from "@cedx/core/Web/PaginationState.js";
import {assert} from "chai";

/**
 * Tests the features of the {@link PaginationState} class.
 */
describe("PaginationState", () => {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const {equal} = assert;

	describe("lastPage", () => {
		it("should return the total count divided by the page size rounded up", () => {
			equal(new PaginationState({totalItemCount: 0}).lastPage, 0);
			equal(new PaginationState({itemsPerPage: 1, totalItemCount: 123}).lastPage, 123);
			equal(new PaginationState({itemsPerPage: 10, totalItemCount: 25}).lastPage, 3);
		});
	});

	describe("limit", () => {
		it("should return the same value as the page size, with a minimum of 1 and a maxiumum of 1000", () => {
			equal(new PaginationState({itemsPerPage: 0}).limit, 1);
			equal(new PaginationState({itemsPerPage: 25}).limit, 25);
			equal(new PaginationState({itemsPerPage: 123456}).limit, 1000);
		});
	});

	describe("offset", () => {
		it("should return the page size multiplied by the page index minus one", () => {
			equal(new PaginationState({currentPage: 1}).offset, 0);
			equal(new PaginationState({currentPage: 5, itemsPerPage: 25}).offset, 100);
			equal(new PaginationState({currentPage: 123, itemsPerPage: 5}).offset, 610);
		});
	});

	describe("searchParams", () => {
		it("should include a `page` parameter", () => {
			const {searchParams} = new PaginationState;
			assert.isTrue(searchParams.has("page"));
			equal(searchParams.get("page"), "1");

			equal(new PaginationState({currentPage: -5}).searchParams.get("page"), "1");
			equal(new PaginationState({currentPage: 123}).searchParams.get("page"), "123");
		});

		it("should include a `perPage` parameter", () => {
			const {searchParams} = new PaginationState;
			assert.isTrue(searchParams.has("perPage"));
			equal(searchParams.get("perPage"), "25");

			equal(new PaginationState({itemsPerPage: 66}).searchParams.get("perPage"), "66");
			equal(new PaginationState({itemsPerPage: 123456}).searchParams.get("perPage"), "1000");
		});
	});

	describe("fromResponse()", () => {
		it("should create an instance initialized from the response headers", () => {
			const pagination = PaginationState.fromResponse(new Response(null, {headers: {
				"X-Pagination-Current-Page": "123",
				"X-Pagination-Per-Page": "33",
				"X-Pagination-Total-Count": "666"
			}}));

			equal(pagination.currentPage, 123);
			equal(pagination.itemsPerPage, 33);
			equal(pagination.totalItemCount, 666);
		});
	});
});
