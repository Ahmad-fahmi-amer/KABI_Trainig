import redisClient, {
  connectRedis,
  disconnectRedis,
} from "../config/redis.client.js";

async function testRedis() {
  try {
    await connectRedis();

    // 1. SET simple string
    await redisClient.set("app:name", "Task Management API");

    // 2. GET simple string
    const appName = await redisClient.get("app:name");

    console.log("App name:", appName);

    // 3. DELETE key
    await redisClient.del("app:name");

    // 4. GET deleted key
    const deletedAppName = await redisClient.get("app:name");

    console.log("After delete:", deletedAppName);

    // 5. JavaScript object
    const task = {
      id: 1,
      title: "Learn Redis",
      completed: false,
    };

    // 6. Serialize object before storing it
    await redisClient.set("task:1", JSON.stringify(task));

    // 7. Redis returns a string
    const cachedTask = await redisClient.get("task:1");

    console.log("Raw Redis value:", cachedTask);

    // 8. Deserialize it back into a JavaScript object
    const parsedTask = JSON.parse(cachedTask);

    console.log("Parsed task:", parsedTask);
    console.log("Task title:", parsedTask.title);
  } catch (error) {
    console.error("Redis test failed:", error);
    process.exitCode = 1;
  } finally {
    await disconnectRedis();
  }
}

testRedis();
