import {SpanStatusCode, trace} from "@opentelemetry/api";

type AsyncFunction = () => Promise<unknown>;
const TRACER_NAME = 'withNewSpanAsyncTracer';

export function withNewSpanAsync<T>(spanName: string, fn: AsyncFunction): T {
    // start synchronously
    const tracer = trace.getTracer(TRACER_NAME);
    const span = tracer.startSpan(spanName);

    return Promise.resolve(fn())
        .catch((e: Error) => {
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: e.message || ''
            });
        })
        .finally(
            () => {
                span.end();
            }
        ) as T;
}