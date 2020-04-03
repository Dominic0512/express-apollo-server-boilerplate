import path from "path";
import fs from "fs";
import { createLogger, format, transports, addColors } from "winston";

const logDirectory = path.resolve("./", "logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const config = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "yellow",
    verbose: "cyan",
    debug: "blue",
    silly: "magenta"
  }
};

addColors(config.colors);

const options = {
  allLog: {
    level: "http",
    filename: path.resolve(logDirectory, "all.log")
  },
  errorLog: {
    level: "error",
    filename: path.resolve(logDirectory, "error.log")
  }
};

const formatParams = info => {
  let { timestamp, level, message } = info;
  message = message.replace(/[\r\n]/g, "");
  return `[${timestamp}] ${level}: ${message}`;
};

const logger = createLogger({
  level: "http",
  levels: config.levels,
  handleExceptions: true,
  json: true,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(formatParams)
  ),
  transports: [
    new transports.File(options.allLog),
    new transports.File(options.errorLog),
    new transports.Console()
  ]
});

logger.stream = {
  write: (message, encoding) => {
    logger.http(message);
  }
};

export default logger;
