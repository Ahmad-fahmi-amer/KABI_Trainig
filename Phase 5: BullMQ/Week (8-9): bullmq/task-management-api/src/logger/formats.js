import { format } from "winston";

const { combine, timestamp, colorize, errors, printf } = format;

const developmentFormat = combine(
  timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),

  errors({
    stack: true,
  }),

  colorize({
    all: true,
  }),

  printf(({ timestamp, level, message, stack, ...meta }) => {
    const metadata =
      Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";

    return `${timestamp} ${level}: ${stack || message}${metadata}`;
  }),
);

const productionFormat = combine(
  timestamp(),

  errors({
    stack: true,
  }),

  format.json(),
);

export { developmentFormat, productionFormat };
