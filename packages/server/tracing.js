'use strict';

require('dotenv').config();
const logger = require('./logger');

const { OTEL_EXPORTER_OTLP_ENDPOINT, OTEL_SERVICE_NAME } = process.env;
console.debug(`URL: ${OTEL_EXPORTER_OTLP_ENDPOINT}`);
console.debug(`SERVICE NAME: ${OTEL_SERVICE_NAME}`);

const opentelemetry = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } =  require('@opentelemetry/exporter-trace-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const sdk = new opentelemetry.NodeSDK({
    traceExporter: new OTLPTraceExporter({
    // url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
        // only set if sending data directly to honeycomb not through an OTEL Collector
        // headers: {
        //     'X-Honeycomb-Team': process.env.HONEYCOMB_API_KEY
        // }
    }),
    serviceName: process.env.OTEL_SERVICE_NAME,
    instrumentations: [getNodeAutoInstrumentations()],
});

console.log('Starting OpenTelemetry Node SDK');
sdk.start();

// make sure we flush last logs if terminating
process.on('SIGTERM', () => {
    sdk
        .shutdown()
        .finally(() => process.exit(0));
});

module.exports = sdk;