import { createLogger } from "winston";
import { developmentFormat, productionFormat } from "./formats.js";
import appTransports from "./tranports.js";
import { env } from "../config/env.js";

const isProduction = env.NODE_ENV === "production";

const logger = createLogger({
  level: isProduction ? "info" : "debug",
  format: isProduction ? productionFormat : developmentFormat,
  transports: appTransports,
  exitOnError: false,
  defaultMeta: {
    service: "recruitment-api",
  },
});
export default logger;
