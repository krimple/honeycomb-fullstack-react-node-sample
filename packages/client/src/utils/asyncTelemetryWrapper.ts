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
                  resolve(response as T);
              })
              .catch((e: Error) => {
                  span.setStatus({
                      code: SpanStatusCode.ERROR,
                      message: e.message || ''
                  });
                  reject(e);
              })
                .finally(() => {span.end()})
        });
    });
}

export function doAsyncWithTelemetryNoResults(fn: AsyncFunction, spanName: string): Promise<void> {
    const span  = trace.getTracer('default').startSpan(spanName || 'async-span');

    if (!span) {
        throw new Error('No active span');
    }

    return new Promise<void>((resolve, reject) => {
        context.with(trace.setSpan(context.active(), span), () => {
            return fn()
                .then(() => { resolve(undefined); })
                .catch((e: Error) => {
                    span.setStatus({
                        code: SpanStatusCode.ERROR,
                        message: e.message || ''
                    });
                    reject(e);
                })
                .finally(() => {span.end()})
        });
    });
}