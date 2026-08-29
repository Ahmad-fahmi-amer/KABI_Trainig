import { transports } from "winston";

const consoleTransport = new transports.Console();

const appTransports = [consoleTransport];

export default appTransports;
