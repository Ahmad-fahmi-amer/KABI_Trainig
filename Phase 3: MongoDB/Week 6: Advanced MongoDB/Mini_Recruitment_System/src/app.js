import express from "express";
import router from "./api/v1/index.js";
import { errorHandler } from "./middlewares/core/error.middleware.js";
import { loggerMiddleware } from "./middlewares/core/logger.middleware.js";
import { notFound } from "./middlewares/core/not-found.middleware.js";
import { requestIdMiddleware } from "./middlewares/core/request-id.middleware.js";
import { responseFormatter } from "./response/responseFormatter.js";

const app = express();

app.disable("x-powered-by");

app.use(requestIdMiddleware);
app.use(loggerMiddleware);
app.use(express.json({ limit: "100kb" }));
app.use(responseFormatter);

app.use("/api/v1", router);

app.use(notFound);
app.use(errorHandler);

export default app;
