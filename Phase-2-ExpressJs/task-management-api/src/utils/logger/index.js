import fs from "fs";
import path from "path";

const logsDir = "logs";

function ensureLogsDir() {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }
}

function writeLog(file, data) {
  ensureLogsDir();
  fs.appendFileSync(path.join(logsDir, file), data + "\n");
}

export const logger = {
  info(message) {
    writeLog("app.log", `[INFO] ${message}`);
  },

  error(message) {
    writeLog("error.log", `[ERROR] ${message}`);
  },
};
