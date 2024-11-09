'use strict';

const dotenv = require('dotenv');
dotenv.config();

const opentelemetry = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } =  require('@opentelemetry/exporter-trace-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

console.log(`endpoint: ${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}`)
console.log(`key: ${process.env.HONEYCOMB_API_KEY}`)
const sdk = new opentelemetry.NodeSDK({
    traceExporter: new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
        headers: {
            'x-honeycomb-team': process.env.HONEYCOMB_API_KEY
        }
    }),
    serviceName: 'express-server',
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