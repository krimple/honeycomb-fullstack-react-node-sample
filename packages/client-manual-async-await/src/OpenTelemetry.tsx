import installOpenTelemetry from "./otel-config.ts";

/**
 * Alternative to installing from the `otel-config` script in main: Just mount
 * this component at the top of your component tree instead. This is less desirable
 * as it will require an initial render to configure otel.
 *
 * @constructor
 */
export default function OpenTelemetry() {
    installOpenTelemetry();
    return null;
}