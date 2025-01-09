// import { StackContextManager } from '@opentelemetry/sdk-trace-web';
import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import * as api from "@opentelemetry/api";

const configDefaults = {
    ignoreNetworkEvents: true,
    // TODO - parameterize this into .env or something for a less brittle build
    propagateTraceHeaderCorsUrls: [
        // defaulting to every outgoing host
        /.+/g,
        //import.meta.env.VITE_OTEL_APPSERVER_PROPAGATION_REGEXP
    ]
}

export default function installOpenTelemetry() {
    try {
        // doesn't specify SDK endpoint, defaults to us v1/traces endpoint
        const sdk = new HoneycombWebSDK({
            // turn on to get additional tracing info in console log
            debug: true, // Set to false for production environment.

            endpoint: import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT,
            // endpoint: 'https://api-dogfood.honeycomb.io',
            localVisualizations: true,
            // contextManager: new StackContextManager(),

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
                    '@opentelemetry/instrumentation-fetch': {
                        ...configDefaults,
                        applyCustomAttributesOnSpan: (span: api.Span, request: Request | RequestInit) => {
                            const headers = request instanceof Request ? request.headers : new Headers(request?.headers);
                            headers?.forEach((value, key) => {
                                console.log(key, value);
                                if (key === 'Content-Type') {
                                    span.setAttribute('app.content.type', value);
                                }
                            });
                        },
                    },
                    '@opentelemetry/instrumentation-document-load': configDefaults,
                    '@opentelemetry/instrumentation-user-interaction': {
                        enabled: true,
                        eventNames: ['click', 'submit', 'reset']
                    }
                }),
            ],
        });
        sdk.start();

        // console.dir(sdk);

        // @ts-expect-error blah blah ginger see Gary Larson
        sdk['_tracerProvider']['_registeredSpanProcessors'].forEach(item => {
            console.log('Type of processor item', typeof item);
            if (item['_sessionId']) {
                console.log('Session ID?', `https://ui-dogfood.honeycomb.io/empire-of-software/environments/ken-dev/datasets/react-frontend/session-timeline-experiment/${item['_sessionId']}`);
            }
        });
    } catch (e) {
        console.log(`An error occurred wiring up the collector...`);
        console.error(e);
        return null;
    }
    return null;
}
