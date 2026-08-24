import RedisExecutor from "./RedisExecutor.js";

class RedisCache {
  constructor({
    client,
    namespace,
    defaultTtl = null,
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    logger,
  }) {
    if (!client) {
      throw new TypeError("RedisCache requires a client");
    }

    if (!namespace || typeof namespace !== "string") {
      throw new TypeError("RedisCache requires a non-empty namespace");
    }

    if (!logger) {
      throw new TypeError("RedisCache requires a logger");
    }

    this.#validateTtl(defaultTtl, "defaultTtl");

    if (typeof serializer !== "function") {
      throw new TypeError("serializer must be a function");
    }

    if (typeof deserializer !== "function") {
      throw new TypeError("deserializer must be a function");
    }
    this.executor = new RedisExecutor({
      client,
      logger,
    });
    this.client = client;
    this.namespace = namespace;
    this.defaultTtl = defaultTtl;
    this.serializer = serializer;
    this.deserializer = deserializer;
    this.logger = logger;
  }

  #validateTtl(ttl, fieldName = "ttl") {
    if (ttl !== null && (!Number.isInteger(ttl) || ttl <= 0)) {
      throw new TypeError(`${fieldName} must be a positive integer or null`);
    }
  }
  #buildKey(id) {
    return `${this.namespace}:${id}`;
  }

  async get(id) {
    const normalizedId = String(id);
    const key = this.#buildKey(normalizedId);
    return this.executor.execute({
      metadata: {
        namespace: this.namespace,
        key: normalizedId,
      },
      failureEvent: "cache_read_failed",
      fallback: null,
      operation: async () => {
        const cached = await this.client.get(key);

        if (cached === null) {
          this.logger.debug({
            event: `cache_miss`,
            namespace: this.namespace,
            key: normalizedId,
          });

          return null;
        }

        this.logger.debug({
          event: `cache_hit`,
          namespace: this.namespace,
          key: normalizedId,
        });

        return this.deserializer(cached);
      },
    });
  }

  async set(id, value, { ttl } = {}) {
    const normalizedId = String(id);
    const key = this.#buildKey(normalizedId);
    const effectiveTtl = ttl ?? this.defaultTtl;
    this.#validateTtl(effectiveTtl);

    return this.executor.execute({
      metadata: {
        namespace: this.namespace,
        key: normalizedId,
      },
      failureEvent: "cache_write_failed",
      fallback: false,
      operation: async () => {
        const serializedValue = this.serializer(value);

        const options = effectiveTtl === null ? {} : { EX: effectiveTtl };

        await this.client.set(key, serializedValue, options);

        return true;
      },
    });
  }
  async del(id) {
    const normalizedId = String(id);
    const key = this.#buildKey(normalizedId);
    return this.executor.execute({
      metadata: {
        namespace: this.namespace,
        key: normalizedId,
      },
      failureEvent: "cache_delete_failed",
      fallback: false,

      operation: async () => {
        await this.client.del(key);
        return true;
      },
    });
  }
}
export default RedisCache;
