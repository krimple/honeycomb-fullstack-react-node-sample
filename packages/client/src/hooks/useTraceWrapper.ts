/*
import {context, SpanStatusCode, trace} from '@opentelemetry/api'
import {RequestInit, Response} from "node/globals";

export function useOtelWrappedFetch<T>(name: string) {

    const fetch = (
        input: string | URL | globalThis.Request,
        init?: RequestInit,
    ): Promise<Response> {

        Promise.resolve(fetch(input, init))
            .catch((e: Error) => {})

    }
    const tracer = trace.getTracer('trace-wrapper');

    // TODO - pass an async function to the high level wrapper, create the span, then
    const query = async (url: string) => {
        const span = tracer.startSpan(name);
        try {
            // move the context.with to around fetch, not around error handling
           return await context.with(trace.setSpan(context.active(), span), async () => {
               // abstract this?
               const result = await fetch(url, {
                   headers: {
                       'Content-Type': 'application/json'
                   }
               });
               if (!result.ok) {
                   span.setStatus({
                       code: SpanStatusCode.ERROR,
                       message: result.statusText,
                   });
                   // TODO - handle this properly?
                   return;
               } else {
                   return await result.json() as T;
               }
           });
        } catch (e) {
            // @ts-expect-error type not known
            span.recordException(e);
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: 'getMessage' in e ? e.getMessage() e.toString()
            });
            console.error(e);
        } finally {
            span.end();
        }
    };

    const mutation = async (url: string, body: T) => {
        const span = tracer.startSpan(name);
        try {
            await context.with(trace.setSpan(context.active(), span), async () => {
                // TODO vet this - maybe wrong
                const result = await fetch(url, {
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!result.ok) {
                    span.setStatus({
                        code: SpanStatusCode.ERROR,
                        message: result.statusText,
                    });
                    // TODO - handle this properly?
                    return;
                } else {
                    return await result.json() as T;
                }
            });
        } catch (e) {
            // @ts-expect-error type not known
            span.recordException(e);
            console.error(e);
        } finally {
            span.end();
        }
    };
    return [ query, mutation ];
}


 */