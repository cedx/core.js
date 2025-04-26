/**
 * Represents a country/region.
 */
export class RegionInfo {

	/**
	 * The two-letter code defined in ISO 3166 for the country/region.
	 */
	readonly name: string;

	/**
	 * Creates a new region.
	 * @param name A string that contains a two-letter code defined in ISO 3166 for country/region.
	 */
	constructor(name: string) {
		this.name = name.toUpperCase();
	}

	/**
	 * The emoji flag corresponding to this region.
	 */
	get emojiFlag(): string {
		return String.fromCodePoint(127_397 + this.name.charCodeAt(0), 127_397 + this.name.charCodeAt(1));
	}

	/**
	 * Returns an appropriately localized display name for the specified locale.
	 * @param locale The target locale.
	 * @returns The localized display name in the specified locale.
	 */
	displayName(locale: Intl.Locale|string = navigator.language): string {
		return new Intl.DisplayNames(locale, {type: "region"}).of(this.name) ?? this.name;
	}

	/**
	 * Returns a JSON representation of this object.
	 * @returns The JSON representation of this object.
	 */
	toJSON(): string {
		return this.toString();
	}

	/**
	 * Returns a string representation of this object.
	 * @returns The string representation of this object.
	 */
	toString(): string {
		return this.name;
	}
}
