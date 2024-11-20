// observability.jsx|tsx
import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';

const configDefaults = {
    ignoreNetworkEvents: true,
    // propagateTraceHeaderCorsUrls: [
    //     /.+/g, // Regex to match your backend URLs. Update to the domains you wish to include.
    // ]
}
export default function Observability(){
    // get out early and do NOTHING if we're running in development
    if (import.meta.env.MODE === 'development') {
        console.log(`Skipping o11y in dev mode`);
        return null;
    }

    try {
        // doesn't specify SDK endpoint, defaults to us v1/traces endpoint
        const sdk = new HoneycombWebSDK({
            // turn on to get additional tracing info in console log
            // debug: true, // Set to false for production environment.
            endpoint: import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT,
            // localVisualizations: true,
            // NOTE - only enable if you aren't using an OTEL collector endpoint
            // apiKey: import.meta.env.VITE_HONEYCOMB_API_KEY,
            // NOTE - turning on if I am pointing to the non-default HC endpoint
            skipOptionsValidation: true,
            serviceName: import.meta.env.VITE_OTEL_SERVICE_NAME,
            instrumentations: [
                getWebAutoInstrumentations({
                    // Loads custom configuration for xml-http-request instrumentation.
                    '@opentelemetry/instrumentation-xml-http-request': configDefaults,
                    '@opentelemetry/instrumentation-fetch': configDefaults,
                    '@opentelemetry/instrumentation-document-load': configDefaults,
                    '@opentelemetry/instrumentation-user-interaction': {enabled: true}
                }),
            ],
        });
        sdk.start();
    } catch (e) {
        console.error(e);
        return null;
    }
    return null;
}
