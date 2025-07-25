import {Duration} from "#Base/Duration.js";
import type {ICache, ICacheSerializer} from "./ICache.js";

/**
 * An in-memory cache value.
 */
export interface IMemoryCacheEntry {

	/**
	 * The expiration date and time.
	 */
	expires: Date|null;

	/**
	 * The cached value.
	 */
	value: string;
};

/**
 * Implements an in-memory cache.
 */
export class MemoryCache implements ICache {

	/**
	 * The cache data.
	 */
	readonly #cache = new Map<string, IMemoryCacheEntry>;

	/**
	 * The default duration in seconds before a cache entry will expire.
	 */
	readonly #defaultDuration: number;

	/**
	 * A string prefixed to every cache key so that it is unique globally in the whole cache storage.
	 */
	readonly #keyPrefix: string;

	/**
	 * The instance used to serialize and unserialize cached data.
	 */
	readonly #serializer: ICacheSerializer;

	/**
	 * Creates a new memory service.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options: MemoryCacheOptions = {}) {
		this.#defaultDuration = options.defaultDuration ?? 0;
		this.#keyPrefix = options.keyPrefix ?? "";
		this.#serializer = options.serializer ?? {serialize: JSON.stringify, unserialize: JSON.parse};
	}

	/**
	 * Removes all entries from this cache.
	 * @returns Resolves when this cache has been cleared.
	 */
	clear(): Promise<void> {
		this.#cache.clear();
		return Promise.resolve();
	}

	/**
	 * Removes the value associated with the specified key.
	 * @param key The cache key.
	 * @returns Resolves when the value has been removed.
	 */
	delete(key: string): Promise<void> {
		this.#cache.delete(this.#buildKey(key));
		return Promise.resolve();
	}

	/**
	 * Gets the value associated with the specified key.
	 * @param key The cache key.
	 * @returns The cached value, or `null` if the key does not exist.
	 */
	get<T>(key: string): Promise<T|null> {
		return Promise.resolve(this.#cacheExpired(key) ? null : this.#serializer.unserialize(this.#cache.get(this.#buildKey(key))!.value) as T);
	}

	/**
	 * Gets the value associated with the specified key if it exists, or generates a new entry using the value from the given factory.
	 * @param key The cache key.
	 * @param factory The factory that creates the value if the key does not exist in the cache.
	 * @param duration The number of seconds in which the cached value will expire.
	 * @returns The cached value.
	 */
	async getOrCreate<T>(key: string, factory: () => Promise<T>, duration = -1): Promise<T> {
		if (!await this.has(key)) await this.set(key, await factory(), duration);
		return (await this.get(key))!;
	}

	/**
	 * Gets a value indicating whether this cache contains the specified key.
	 * @param key The cache key.
	 * @returns `true` if this cache contains the specified key, otherwise `false`.
	 */
	has(key: string): Promise<boolean> {
		return Promise.resolve(!this.#cacheExpired(key));
	}

	/**
	 * Associates a given value with the specified key.
	 * @param key The cache key.
	 * @param value The value to be cached.
	 * @param duration The number of seconds in which the cached value will expire.
	 * @returns This instance.
	 */
	set(key: string, value: unknown, duration = -1): Promise<this> {
		if (duration < 0) duration = this.#defaultDuration;
		this.#cache.set(this.#buildKey(key), {
			expires: duration > 0 ? new Date(Date.now() + (duration * Duration.Second)) : null,
			value: this.#serializer.serialize(value)
		});

		return Promise.resolve(this);
	}

	/**
	 * Builds a normalized cache key from the given key.
	 * @param key The original key.
	 * @returns The normalized cache key.
	 */
	#buildKey(key: string): string {
		return `${this.#keyPrefix}${key}`;
	}

	/**
	 * Returns a value indicating whether the cached data with the specified key has expired.
	 * @param key The cache key.
	 * @returns `true` if the cached data with the specified key has expired, otherwise `false`.
	 */
	#cacheExpired(key: string): boolean {
		const prefixedKey = this.#buildKey(key);
		if (!this.#cache.has(prefixedKey)) return true;

		const {expires} = this.#cache.get(prefixedKey)!;
		if (!expires || (expires.getTime() > Date.now())) return false;

		this.#cache.delete(prefixedKey);
		return true;
	}
}

/**
 * Defines the options of a {@link MemoryCache} instance.
 */
export type MemoryCacheOptions = Partial<{

	/**
	 * The default duration in seconds before a cache entry will expire.
	 */
	defaultDuration: number;

	/**
	 * A string prefixed to every cache key so that it is unique globally in the whole cache storage.
	 */
	keyPrefix: string;

	/**
	 * The instance used to serialize and unserialize cached data.
	 */
	serializer: ICacheSerializer;
}>;
