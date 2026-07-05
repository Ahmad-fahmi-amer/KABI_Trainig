import express from "express";
import { errorHandler } from "./middlewares/core/error.middleware.js";
import { requestMiddlewareId } from "./middlewares/core/request-id.middleware.js";
import { loggerMiddleware } from "./middlewares/core/logger.middleware.js";
import { notFound } from "./middlewares/core/not-found.middleware.js";
import router from "./api/v1/index.js";

const app = express();
app.use(requestMiddlewareId);

app.use(loggerMiddleware);
app.use(express.json());

app.use("/api/v1", router);
app.use(notFound);
app.use(errorHandler);
export default app;
