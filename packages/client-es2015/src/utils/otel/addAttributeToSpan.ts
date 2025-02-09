import { trace } from "@opentelemetry/api";

export function otelSendAttributeInCurrentSpan(attributeName: string, attributeValue: string) {
    const span = trace.getActiveSpan();
    if (span && span.isRecording()) {
        span.setAttribute(attributeName, attributeValue);
    }
}