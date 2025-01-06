import {context, SpanStatusCode, trace} from "@opentelemetry/api";

type AsyncFunction = () => Promise<unknown>;

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
 * @param spanName the name for the newly created span, since we're not wrapping via auto instrumentation. Defaults to 'async-span'
 */
export function otelWrapperWithResponse<T>(fn: AsyncFunction, spanName: string): Promise<T> {
    const span  = trace.getTracer('default').startSpan(spanName || 'async-span');

    // TODO - evaulate a better option here
    // This is a problem, though maybe you don't want to blow up the app?
    if (!span) {
        throw new Error('No active span');
    }

    // treat the async function as a promise
    return new Promise<T>((resolve, reject) => {
        // this is the otel wrapping magic - add a new span to the active context
        // and this will send the telemetry around the method we wrap
        context.with(trace.setSpan(context.active(), span), () => {
            return fn()
                .then((response) => {
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
                .finally(() => {span.end()})
        });
    });
}