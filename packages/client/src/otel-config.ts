// observability.jsx|tsx
import { StackContextManager } from '@opentelemetry/sdk-trace-web';
import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import {useEffect} from "react";


const configDefaults = {
    ignoreNetworkEvents: true,
    // TODO - parametize this into .env or something for a less brittle build
    propagateTraceHeaderCorsUrls: [new RegExp('localhost:9999')]
}

export default function installOpenTelemetry() {
    try {
        // doesn't specify SDK endpoint, defaults to us v1/traces endpoint
        const sdk = new HoneycombWebSDK({
            // turn on to get additional tracing info in console log
            // debug: true, // Set to false for production environment.
            endpoint: import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT,
            // endpoint: 'https://api-dogfood.honeycomb.io',
            localVisualizations: true,
            contextManager: new StackContextManager(),

            // NOTE - only enable if you aren't using an OTEL collector endpoint
            // apiKey: import.meta.env.VITE_HONEYCOMB_API_KEY,

            // NOTE - turning this on - I am pointing to the non-default HC endpoint
            // (the otel collector defined in /otel-collector and kicked off in
            // the docker-compose.yml file)
            skipOptionsValidation: true,
            serviceName: import.meta.env.VITE_OTEL_SERVICE_NAME,
            instrumentations: [
                getWebAutoInstrumentations({
                    // Loads custom configuration for xml-http-request instrumentation.
                    '@opentelemetry/instrumentation-xml-http-request': configDefaults,
                    '@opentelemetry/instrumentation-fetch': configDefaults,
                    '@opentelemetry/instrumentation-document-load': configDefaults,
                    '@opentelemetry/instrumentation-user-interaction': {
                        enabled: true,
                        eventNames: ['click', 'submit', 'reset']
                    }
                }),
            ],
        });
        sdk.start();
    } catch (e) {
        console.log(`An error occurred wiring up the collector...`);
        console.error(e);
        return null;
    }
    return null;
}
