import { createLogger } from "winston";
import { env } from "../config/env.js";
import { developmentFormat, productionFormat } from "./formats.js";
import appTransports from "./transports.js";

const isProduction = env.NODE_ENV === "production";

const logger = createLogger({
  level: isProduction ? "info" : "debug",
  format: isProduction ? productionFormat : developmentFormat,
  transports: appTransports,
  exitOnError: false,
  defaultMeta: {
    service: "mini-recruitment-system-api",
  },
});

export default logger;
