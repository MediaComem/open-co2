import config from "config";
import * as winston from "winston";
import "winston-daily-rotate-file";

// Transports
// Transport Console
const consoleTransport = new winston.transports.Console();
// Transport File
const fileRotateTransport = new winston.transports.DailyRotateFile({
  datePattern: "YYYY-MM-DD",
  filename: "open-co2_%DATE%.log",
  dirname: process.env.LOG_DIR || config.get("log.dir"),
  maxSize: "20m",
  maxFiles: "14d",
  zippedArchive: true
});

// Format
const logFormat = winston.format.combine(
  winston.format.colorize({ all: false }),
  winston.format.timestamp({
    format: "MMM-DD-YYYY HH:mm:ss" // "YYYY-MM-DD hh:mm:ss.SSS A"
  }),
  winston.format.align(),
  winston.format.printf(
    (data) => `${data.timestamp} ${data.level}: ${data.message}`
  )
);

// Config
const logConfig = {
  level: process.env.LOG_LEVEL || config.get("log.level"),
  format: logFormat,
  transports: [consoleTransport, fileRotateTransport],
  exitOnError: false
};

// Logger
const logger = winston.createLogger(logConfig);

export default logger;
