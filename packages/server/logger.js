const { trace , context } = require('@opentelemetry/api');
const bunyan = require('bunyan');

const tracer = trace.getTracer('express-server', '1.0.0');

const otelStream = {
    write: (logRecord) => {
        // Parse the log record if it's a string
        const log = typeof logRecord === 'string' ? JSON.parse(logRecord) : logRecord;

        // Get the current active span
        const currentSpan = trace.getSpan(context.active());

        if (currentSpan) {
            // Add log as an event to the current span
            currentSpan.addEvent('log-event', {
                level: log.level,
                message: log.msg,
                ...log,
            });
        } else {
            // Optionally, start a new span if no active span exists
            const span = tracer.startSpan('log');
            span.addEvent('log', {
                level: log.level,
                message: log.msg,
                ...log,
            });
            span.end();
        }
    },
}

const logger = bunyan.createLogger({
    name: 'backend',
    streams: [
        {
            level: 'info',
            stream: otelStream,
            type: 'raw'
        }
    ]
})

module.exports = logger;
