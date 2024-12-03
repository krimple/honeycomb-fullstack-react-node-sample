const { trace, context } = require("@opentelemetry/api");
const bunyan = require("bunyan");

/*const otelStream = {
  write: (logRecord) => {
    console.log(`writing log record ${JSON.stringify(logRecord, null, 2)}`);
    const currentSpan = trace.getSpan(context.active());
    // Parse the log record if it's a string
    const log =
      typeof logRecord === "string" ? JSON.parse(logRecord) : logRecord;
    if (logRecord) {
      console.log(`Log record time: ${logRecord.time.getTime()}`);
    }

    console.log(log.time.getTime());
    if (currentSpan) {
      // Add log as an event to the current span
      currentSpan.addEvent(
        "log-event",
        {
          level: log.level,
          message: log.msg,
        },
        log.time.getTime(),
        //Date.now(),
      );
    } else {
      console.log(
        `Cannot send log record: ${JSON.stringify(logRecord, null, 2)}`,
      );
    }
  },
};
 */

const logger = bunyan.createLogger({
  name: "backend",
  level: "warn"
});

module.exports = logger;
