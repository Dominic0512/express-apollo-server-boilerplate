import morgan from "morgan";
import logger from "../utils/logger";

morgan.token(`status`, (req, res) => {
  const status = (typeof res.headersSent !== `boolean`
  ? Boolean(res._header)
  : res.headersSent)
    ? res.statusCode
    : undefined;

  let color = 0;

  if (status >= 500) {
    color = 31;
  } else if (status >= 400) {
    color = 33;
  } else if (status >= 300) {
    color = 36;
  } else if (status >= 200) {
    color = 32;
  } else {
    color = 0;
  }

  return `\x1b[${color}m${status}\x1b[0m`;
});

const devModify = ":method :url :status :response-time ms";
const combinedModify =
  ':remote-addr :method :url :status :response-time ms :user-agent"';
const morganFormat =
  process.env.NODE_ENV == "development" ? devModify : combinedModify;

export default morgan(morganFormat, { stream: logger.stream });
