import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import * as api from "@opentelemetry/api";
import { v4 } from 'uuid';
import { ZoneContextManager } from '@opentelemetry/context-zone';

const configDefaults = {
    ignoreNetworkEvents: true,
    // this regexp means add to all outgoing fetch/XMLHttpRequest calls
    propagateTraceHeaderCorsUrls: [
        // this regexp means add to all outgoing fetch/XMLHttpRequest calls
        /.*/g,
        // this regexp allows APIs to a specific host - note the escape characters before the forward slashes
        /http:\/\/localhost:8081/
    ]
}

export default function installOpenTelemetry() {
    try {
        // doesn't specify SDK endpoint, defaults to us v1/traces endpoint
        const sdk = new HoneycombWebSDK({
            // turn on to get additional tracing info in console log
            debug: true, // Set to false for production environment.
            contextManager: new ZoneContextManager(),
            // new in 0.15.0 - control the session.id generation process
            sessionProvider: {
                // Our example stores sessionId in a sessionStorage key, so different
                // tabs can have different sessions and timelines of interactions
                getSessionId: function (): string | null {
                    let sessionId = sessionStorage.getItem('sessionId');
                    if (!sessionId) {

                        // create and store
                        sessionId = v4()
                        sessionStorage.setItem('sessionId', sessionId);
                    }
                    return sessionId;
                }
            },

            endpoint: import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT,
            // to help debug
            localVisualizations: true,

            // NOTE - only enable the Honeycomb API key if you aren't using an OTel collector endpoint
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
