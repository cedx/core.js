/**
 * Represents a cache.
 */
export interface ICache {

	/**
	 * Removes all entries from this cache.
	 * @returns Resolves when this cache has been cleared.
	 */
	clear: () => Promise<void>;

	/**
	 * Removes the value associated with the specified key.
	 * @param key The cache key.
	 * @returns Resolves when the value has been removed.
	 */
	delete: (key: string) => Promise<void>;

	/**
	 * Gets the value associated with the specified key.
	 * @param key The cache key.
	 * @returns The cached value, or `null` if the key does not exist.
	 */
	get: <T>(key: string) => Promise<T|null>;

	/**
	 * Gets a value indicating whether this cache contains the specified key.
	 * @param key The cache key.
	 * @returns `true` if this cache contains the specified key, otherwise `false`.
	 */
	has: (key: string) => Promise<boolean>;

	/**
	 * Associates a given value with the specified key.
	 * @param key The cache key.
	 * @param value The value to be cached.
	 * @param duration The number of seconds in which the cached value will expire.
	 * @returns This instance.
	 */
	set: (key: string, value: unknown, duration?: number) => Promise<this>;
}

/**
 * A cache serializer.
 */
export interface ICacheSerializer {

	/**
	 * Serializes the specified value.
	 */
	serialize: (value: unknown) => string;

	/**
	 * Unserializes the specified value.
	 */
	unserialize: (value: string) => any;
};
