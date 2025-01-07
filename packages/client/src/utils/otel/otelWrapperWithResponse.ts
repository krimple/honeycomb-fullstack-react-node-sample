import {SpanStatusCode, trace} from "@opentelemetry/api";

type AsyncFunction = () => Promise<unknown>;
const tracer = trace.getTracer('default');

/**
 * Generates a new span in OpenTelemetry and runs a Promise or async function within it.
 * The async function can be embedded directly with something like:
 * ```
 *   const response = otelWrapperWithResponse<Customer>(async () => {
 *       const result = await fetch('/api/foo');
 *       if (result.ok) {
 *         return result.json() as Customer;
 *       } else {
 *         throw new Error(response.message)
 *       }
 *  });
 * ```
 * @param fn the _thenable_ method to run (your async method here), which will return the type passed in `T` or throw an Error
 * @param spanName the name for the newly created span, since we're not wrapping via auto instrumentation. Defaults to 'otelWrapperWithResponse'
 */
export function otelWrapperWithResponse<T>(fn: AsyncFunction, spanName: string = 'otelWrapperWithResponse'): Promise<T> {
    return tracer.startActiveSpan(spanName, span => {
        return new Promise<T>((resolve, reject) => {
            return fn()
                .then((response) => {
                    // by default, UNSET, so you can decide to set the status of the
                    span.setStatus({
                        code: SpanStatusCode.OK
                    });
                    resolve(response as T);
                })
                .catch((e: Error) => {
                    span.setStatus({
                        code: SpanStatusCode.ERROR,
                        // TODO - could be more explicit, maybe JSON.stringify, etc.
                        message: e.message || 'No error message'
                    });
                    reject(e);
                })
                .finally(() => {
                    span.end()
                })
        });
    });
}