import {SpanStatusCode, context, trace} from "@opentelemetry/api";

type AsyncFunction = () => Promise<unknown>;

export function asyncTelemetryWrapper<T>(fn: AsyncFunction, spanName: string): Promise<T> {
    // start synchronously
    //const span = trace.getActiveSpan() || trace.getTracer('default').startSpan(spanName || 'async-span');
    const span  = trace.getTracer('default').startSpan(spanName || 'async-span');

    if (!span) {
        throw new Error('No active span');
    }

    // treat the async function as a promise
    return new Promise<T>((resolve, reject) => {
        context.with(trace.setSpan(context.active(), span), () => {
            return fn()
              .then((response) => {
                  span.end();
                  resolve(response as T);
              })
              .catch((e: Error) => {
                  span.setStatus({
                      code: SpanStatusCode.ERROR,
                      message: e.message || ''
                  });
                  span.end();
                  reject(e);
              });
        });
    });
}