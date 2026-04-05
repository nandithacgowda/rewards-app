import pino from "pino";
const logger = pino({
  browser: {
    asObject: true,
    serialize: true,
  },
});
export default logger;
