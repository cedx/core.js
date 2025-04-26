/**
 * Represents information relevant to the pagination of data items.
 */
export class PaginationState {

	/**
	 * The current page number.
	 */
	currentPage: number;

	/**
	 * The number of items per page.
	 */
	itemsPerPage: number;

	/**
	 * The total number of items.
	 */
	totalItemCount: number;

	/**
	 * Creates a new pagination.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options: PaginationStateOptions = {}) {
		this.currentPage = Math.max(1, options.currentPage ?? 1);
		this.itemsPerPage = Math.max(1, Math.min(100, options.itemsPerPage ?? 25));
		this.totalItemCount = Math.max(0, options.totalItemCount ?? 0);
	}

	/**
	 * The last page number.
	 */
	get lastPage(): number {
		return Math.ceil(this.totalItemCount / this.itemsPerPage);
	}

	/**
	 * The data limit.
	 */
	get limit(): number {
		return this.itemsPerPage;
	}

	/**
	 * The data offset.
	 */
	get offset(): number {
		return (this.currentPage - 1) * this.itemsPerPage;
	}

	/**
	 * The search parameters corresponding to this object.
	 */
	get searchParams(): URLSearchParams {
		return new URLSearchParams({page: this.currentPage.toString(), perPage: this.itemsPerPage.toString()});
	}

	/**
	 * Creates a new pagination from the HTTP headers of the specified response.
	 * @param response A server response.
	 * @returns The pagination corresponding to the HTTP headers of the specified response.
	 */
	static fromResponse(response: Response): PaginationState {
		return new this({
			currentPage: Number(response.headers.get("X-Pagination-Current-Page") ?? "1"),
			itemsPerPage: Number(response.headers.get("X-Pagination-Per-Page") ?? "25"),
			totalItemCount: Number(response.headers.get("X-Pagination-Total-Count") ?? "0")
		});
	}
}

/**
 * Defines the options of a {@link PaginationState} instance.
 */
export type PaginationStateOptions = Partial<Pick<PaginationState, "currentPage"|"itemsPerPage"|"totalItemCount">>;

/**
 * A list with information relevant to the pagination of its items.
 */
export class PaginatedList<T> {

	/**
	 * The list items.
	 */
	items: T[];

	/**
	 * The information relevant to the pagination of the list items.
	 */
	pagination: PaginationState;

	/**
	 * Creates a new paginated list.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options: PaginatedListOptions<T> = {}) {
		this.items = options.items ?? [];
		this.pagination = options.pagination ?? new PaginationState;
	}

	/**
	 * The number of items in this list.
	 */
	get length(): number {
		return this.items.length;
	}

	/**
	 * Creates an empty paginated list.
	 * @param itemsPerPage The number of items per page.
	 * @returns An empty paginated list with the specified number of items per page.
	 */
	static empty<T>(itemsPerPage: number): PaginatedList<T> {
		return new this({pagination: new PaginationState({itemsPerPage})});
	}

	/**
	 * Returns a new iterator that allows iterating the items of this list.
	 * @returns An iterator over the items of this list.
	 */
	*[Symbol.iterator](): IterableIterator<T> {
		for (const item of this.items) yield item;
	}
}

/**
 * Defines the options of a {@link PaginatedList} instance.
 */
export type PaginatedListOptions<T> = Partial<Pick<PaginatedList<T>, "items"|"pagination">>;
