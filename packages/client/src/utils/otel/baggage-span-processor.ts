import { Span, SpanProcessor } from '@opentelemetry/sdk-trace-web';
import { propagation,  Context } from '@opentelemetry/api';

// Initialize the tracer provider

/**
 * Custom processor to move session ID from attributes to baggage
 */
export class SessionIdToBaggageProcessor implements SpanProcessor {
    onStart(span: Span, parentContext: Context) {
        console.log("i am adding baggage maybe")
        // Extract session ID from span attributes
        const sessionEntry = Object.entries(span['attributes']).find((thing) => {
            console.log(thing);
            return false; // thing === 'session.id'
        });
        const sessionId: string | undefined = sessionEntry ? String(sessionEntry[1]) : undefined;
        // const sessionId: string | undefined = Object.entries(span.attributes).find((element) => {
        //     if (element[0] === 'session.id') {
        //         return element[1];
        //     }
        // });

        if (!sessionId) {
            console.log('could not find session.id');
            return;
        }

        if (sessionId) {
            console.log("Creating baggage");
            // todo - in one step
            const baggage = propagation.getBaggage(parentContext) || propagation.createBaggage();
            const newBaggage = baggage.setEntry('session.id', { value: sessionId });
            console.log("Baggage created?")
            console.dir(newBaggage);
            if (newBaggage) {
                console.log("Yes, adding session id");
                propagation.setBaggage(parentContext, newBaggage);
                console.dir(propagation);
            }
        }
    }

    onEnd() {}
    shutdown() { return Promise.resolve(); }
    forceFlush() { return Promise.resolve(); }
}
