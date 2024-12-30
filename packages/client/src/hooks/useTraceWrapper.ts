import {trace, context} from '@opentelemetry/api'
type callableFunction = () => void;

export function useTraceWrapper(name: string, fn: callableFunction) {

    const tracer = trace.getTracer('trace-wrapper');
    return async () => {

        const span = tracer.startSpan(name);
        try {
            return await context.with(trace.setSpan(context.active(), span), async () => {
                const [result] = await Promise.all([fn()]);
                return result;
            });

        } catch (err) {
            // @ts-expect-error TYPE UNKNOWN
            span.recordException(err);
            throw err;
        } finally {
            span.end();
        }
    }
}
