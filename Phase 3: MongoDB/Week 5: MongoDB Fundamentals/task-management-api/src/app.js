import express from "express";
import { errorHandler } from "./middlewares/core/error.middleware.js";
import { requestMiddlewareId } from "./middlewares/core/request-id.middleware.js";
import { loggerMiddleware } from "./middlewares/core/logger.middleware.js";
import { notFound } from "./middlewares/core/not-found.middleware.js";
import router from "./api/v1/index.js";
import { responseFormatter } from "./response/responseFormatter.js";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./openapi/index.js";

const app = express();

app.use(requestMiddlewareId);

app.use(loggerMiddleware);

app.use(express.json({ limit: "100kb" }));

app.use(responseFormatter);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/api/v1", router);

app.use(notFound);

app.use(errorHandler);

export default app;
