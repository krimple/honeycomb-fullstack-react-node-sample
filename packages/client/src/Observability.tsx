// observability.jsx|tsx
import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';

const configDefaults = {
    ignoreNetworkEvents: true,
    propagateTraceHeaderCorsUrls: [
        /.+/g, // Regex to match your backend URLs. Update to the domains you wish to include.
    ]
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
            // debug: true, // Set to false for production environment.
            endpoint: import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT,
            localVisualizations: true,
            apiKey: import.meta.env.VITE_HONEYCOMB_API_KEY, // Replace with your Honeycomb Ingest API Key.
            serviceName: import.meta.env.VITE_HONEYCOMB_APPLICATION_NAME, // Replace with your application name. Honeycomb uses this string to find your dataset when we receive your data. When no matching dataset exists, we create a new one with this name if your API Key has the appropriate permissions.
            instrumentations: [
                getWebAutoInstrumentations({
                    // Loads custom configuration for xml-http-request instrumentation.
                    '@opentelemetry/instrumentation-xml-http-request': configDefaults,
                    '@opentelemetry/instrumentation-fetch': configDefaults,
                    '@opentelemetry/instrumentation-document-load': configDefaults,
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
