import { SpanStatusCode, trace } from "@opentelemetry/api";

const tracer = trace.getTracer("default");

type AsyncFunction = () => Promise<void>;

/**
 * A React hook that provides an OpenTelemetry-wrapped async function.
 *
 * @param spanName The name for the newly created span. Defaults to 'otelWrapper'.
 * @returns A function that wraps an async function within an OpenTelemetry span.
 */
export function useOtelWrapper(spanName: string = "otelWrapper") {
  return (fn: AsyncFunction) => {
    return tracer.startActiveSpan(spanName, async (span) => {
      try {
        await fn();
        span.setStatus({ code: SpanStatusCode.OK });
      } catch (e: any) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: e.message || "No error message",
        });
        span.recordException(e);
        throw e;
      } finally {
        span.end();
      }
    });
  };
}
