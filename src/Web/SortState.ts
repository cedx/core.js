/**
 * Specifies the direction of a sorted property.
 */
export const SortDirection = Object.freeze({

	/**
	 * The sort is ascending.
	 */
	Ascending: "ASC",

	/**
	 * The sort is descending.
	 */
	Descending: "DESC"
});

/**
 * Specifies the direction of a sorted property.
 */
export type SortDirection = typeof SortDirection[keyof typeof SortDirection];

/**
 * Holds the name of a property and the direction to sort by.
 */
export type SortedProperty = [string, SortDirection];

/**
 * Represents information relevant to the sorting of data items.
 */
export class SortState {

	/**
	 * The list of sorted properties.
	 */
	#properties: SortedProperty[];

	/**
	 * Creates new sort.
	 * @param properties The list of properties to be sorted.
	 */
	constructor(properties: SortedProperty[] = []) {
		this.#properties = properties;
	}

	/**
	 * The number of properties.
	 */
	get length(): number {
		return this.#properties.length;
	}

	/**
	 * Creates a new sort from the specified property and direction.
	 * @param property The property name.
	 * @param direction The sort direction.
	 * @returns The sort corresponding to the property and direction.
	 */
	static of(property: string, direction: SortDirection = SortDirection.Ascending): SortState {
		return new this([[property, direction]]);
	}

	/**
	 * Creates a new sort from the specified string.
	 * @param value A string representing a sort.
	 * @returns The sort corresponding to the specified string.
	 */
	static parse(value: string): SortState {
		return new this((value ? value.split(",") : []).map(item => {
			const direction = item.startsWith("-") ? SortDirection.Descending : SortDirection.Ascending;
			return [direction == SortDirection.Ascending ? item : item.slice(1), direction];
		}));
	}

	/**
	 * Returns a new iterator that allows iterating the entries of this sort.
	 * @returns An iterator over the sorted properties.
	 */
	*[Symbol.iterator](): IterableIterator<SortedProperty> {
		for (const entry of this.#properties) yield entry;
	}

	/**
	 * Appends the specified property to this sort.
	 * @param property The property name.
	 * @param direction The sort direction.
	 * @returns This instance.
	 */
	append(property: string, direction: SortDirection): this {
		this.delete(property);
		this.#properties.push([property, direction]);
		return this;
	}

	/**
	 * Gets the sorted property at the specified index.
	 * @param index The position in this sort.
	 * @returns The sorted property at the specified index, or `null` if it doesn't exist.
	 */
	at(index: number): SortedProperty|null {
		return this.#properties.at(index) ?? null;
	}

	/**
	 * Compares the specified objects, according to the current sort properties.
	 * @param x The first object to compare.
	 * @param y The second object to compare.
	 * @returns A value indicating the relationship between the two objects.
	 */
	compare(x: object, y: object): number {
		for (const [property, direction] of this.#properties) {
			const xAttr = Reflect.get(x, property); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
			const yAttr = Reflect.get(y, property); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
			const value = xAttr > yAttr ? 1 : (xAttr < yAttr ? -1 : 0);
			if (value) return direction == SortDirection.Ascending ? value : -value;
		}

		return 0;
	}

	/**
	 * Removes the specified property from this sort.
	 * @param property The property name.
	 */
	delete(property: string): void {
		this.#properties = this.#properties.filter(([key]) => key != property);
	}

	/**
	 * Gets the direction associated with the specified property.
	 * @param property The property name.
	 * @returns The direction associated with the specified property, or `null` if the property doesn't exist.
	 */
	get(property: string): SortDirection|null {
		for (const [key, direction] of this.#properties) if (key == property) return direction;
		return null;
	}

	/**
	 * Gets the icon corresponding to the specified property.
	 * @param property The property name.
	 * @returns The icon corresponding to the specified property.
	 */
	getIcon(property: string): string {
		switch (this.get(property)) {
			case SortDirection.Ascending: return "arrow_upward";
			case SortDirection.Descending: return "arrow_downward";
			default: return "swap_vert";
		}
	}

	/**
	 * Returns a value indicating whether the specified property exists in this sort.
	 * @param property The property name.
	 * @returns `true` if the specified property exists in this sort, otherwise `false`.
	 */
	has(property: string): boolean {
		return this.#properties.some(([key]) => key == property);
	}

	/**
	 * Gets the index of the specified property in the underlying list.
	 * @param property The property name.
	 * @returns The index of the specified property, or `-1` if the property is not found.
	 */
	indexOf(property: string): number {
		for (const [index, [key]] of this.#properties.entries()) if (key == property) return index;
		return -1;
	}

	/**
	 * Prepends the specified property to this sort.
	 * @param property The property name.
	 * @param direction The sort direction.
	 * @returns This instance.
	 */
	prepend(property: string, direction: SortDirection): this {
		this.delete(property);
		this.#properties.unshift([property, direction]);
		return this;
	}

	/**
	 * Returns a value indicating whether the current sort satisfies the specified conditions.
	 * @param conditions The conditions to satisfy.
	 * @returns `true` if the current sort satisfies the specified conditions, otherwise `false`.
	 */
	satisfies(conditions: Partial<{min: number, max: number, properties: string[]}> = {}): boolean {
		const min = conditions.min ?? -1;
		if (min >= 0) return this.length >= min;

		const max = conditions.max ?? -1;
		if (max >= 0) return this.length <= max;

		const properties = conditions.properties ?? [];
		return properties.length ? this.#properties.every(([key]) => properties.includes(key)) : true;
	}

	/**
	 * Sets the direction of the specified property.
	 * @param property The property name.
	 * @param direction The sort direction.
	 * @returns This instance.
	 */
	set(property: string, direction: SortDirection): this {
		for (const [index, [key]] of this.#properties.entries()) if (key == property) {
			this.#properties[index] = [key, direction];
			return this;
		}

		return this.append(property, direction);
	}

	/**
	 * Returns a JSON representation of this object.
	 * @returns The JSON representation of this object.
	 */
	toJSON(): string {
		return this.toString();
	}

	/**
	 * Converts this sort to an SQL clause.
	 * @param escape A function used to escape the SQL identifiers.
	 * @returns The SQL clause corresponding to this object.
	 */
	toSql(escape: (identifier: string) => string = id => id): string {
		return this.#properties.map(([property, direction]) => `${escape(property)} ${direction}`).join(", ");
	}

	/**
	 * Returns a string representation of this object.
	 * @returns The string representation of this object.
	 */
	toString(): string {
		return this.#properties.map(([property, direction]) => `${direction == SortDirection.Descending ? "-" : ""}${property}`).join();
	}
}
