import {SpanStatusCode, trace} from "@opentelemetry/api";

const tracer = trace.getTracer('default');
type AsyncFunction = () => Promise<void>;

/**
 * Generates a new span in OpenTelemetry and runs a Promise or async function within it.
 * The async function can be embedded directly with something like:
 * ```
 *   const response = otelWrapper(async () => {
 *       const result = await fetch('/api/foo', {
 *           method: 'POST',
 *           headers: {
 *               'Content-Type': 'application/json'
 *           }
 *       });
 *       if (!result.ok) {
 *           // TODO - unpack error to fail
 *           throw new Error(result.message)
 *       }
 *
 *       // other side-effects here...
 *  });
 * ```
 *
 * @param fn the _thenable_ method to run (your async method here). Assume side-effects will happen within the async function and no result returned (except a thrown Error)
 * @param spanName the name for the newly created span, since we're not wrapping via auto instrumentation. Defaults to 'otelWrapper'
 */
export function otelWrapper(fn: AsyncFunction, spanName: string = 'otelWrapper'): Promise<void> {
    // Attach to active span or create a new one if none is active
    return tracer.startActiveSpan(spanName, span => {
        return new Promise<void>((resolve, reject) => {
            // this is the otel wrapping magic - add a new span to the active context
            // and this will send the telemetry around the method we wrap
                fn()
                    .then((result) => {
                        span.setStatus({
                            code: SpanStatusCode.OK
                        });
                        resolve(result);
                    })
                    .catch((e: Error) => {
                        span.setStatus({
                            code: SpanStatusCode.ERROR,
                            // TODO - could be more explicit, maybe JSON.stringify, etc.
                            message: e.message || 'No error message'
                        });
                        span.recordException(e);
                        reject(e);
                    })
                    .finally(() => {span.end()})
            });
        });
}

export async function withSpan<T>(name: string, fn: () => Promise<T> | T): Promise<T> {
    const span = tracer.startSpan(name);
    try {
        const result = await fn(); // Await in case fn() returns a Promise
        return result;
    } catch (e: unknown) {
        if (e instanceof Error) {
            span.recordException(e);
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: "call failed"
            });
        }
        throw e; // Re-throw to propagate the error
    } finally {
        span.end();
    }
}