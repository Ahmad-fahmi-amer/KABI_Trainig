class RedisExecutor {
  constructor({ client, logger }) {
    if (!client) {
      throw new TypeError("RedisExecutor requires a client");
    }

    if (!logger) {
      throw new TypeError("RedisExecutor requires a logger");
    }

    this.client = client;
    this.logger = logger;
  }
  async execute({ failureEvent, fallback, operation, metadata = {} }) {
    if (typeof operation !== "function") {
      throw new TypeError("operation must be function");
    }
    if (!this.client.isReady) {
      return fallback;
    }

    try {
      return await operation();
    } catch (error) {
      this.logger.warn({
        event: failureEvent,
        ...metadata,
        message: error.message,
      });

      return fallback;
    }
  }
}
export default RedisExecutor;
