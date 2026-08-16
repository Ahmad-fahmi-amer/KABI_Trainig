import { transports } from "winston";

const appTransports = [new transports.Console()];

export default appTransports;
