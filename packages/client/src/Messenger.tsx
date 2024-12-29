import { useState, useCallback } from "react";
import { trace } from '@opentelemetry/api';


export default function Messenger() {
    const [messages, setMessages] = useState<string[]>([]);
    const [buttonsEnabled, setButtonsEnabled] = useState(true);

    const addToMessages = useCallback((message: string) => {
        messages.push(message);
        setMessages(messages);
    }, [messages, setMessages]);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, [setMessages]);

    // todo - add state tracking here - various steps
    const callFetch = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            fetch(`${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/random-message`, {
                method: 'POST'
            })
                .then(response => response.json())
                .then(data => {
                    resolve(data.message);
                })
                .catch(e => {
                    reject(e);
                });
        });
    }

    // note - do not use async/await - currently these do not get auto-instrumented
    // and must be manually sent as spans. Normal promises will be wrapped.
    // Alternative if you must use async/await
    // is to compile down to an ES version that supports translating async/await into
    // promises such as ES2015
    const fetchMessages = useCallback(() => {
        clearMessages();
        addToMessages("Getting your messages...");
        setButtonsEnabled(false);
        callFetch()
            .then((message) => {
                addToMessages(message);
            })
            .then(() => callFetch())
            .then((message) => {
                addToMessages(message);
            })
            .catch((e) => {
                // handle error condition
                console.error(e)
            })
            .finally(() => setButtonsEnabled(true));
    }, [addToMessages, clearMessages]);


    const messageEntries = messages.map((m, key) => <p key={key}>{m}</p>);

    // create a span, span event, ->>> log here
    const tracer = trace.getTracer('thing');
    const span = tracer.startSpan('renderer span');
    // custom field - at least app
    console.log(JSON.stringify(messages, null, 2));
    span.setAttribute('app.messages', JSON.stringify(messages));
    span.end();

    return (
        <div>
            <div
                data-testid="message"
                className="mx-auto my-auto h-auto overflow-visible text-xl text-center w-2/3 p-8 b-2 bg-amber-100 border-2"
            >
                { messageEntries }
            </div>
            <div className="mx-auto text-center w-2/3 h-[20%] py-2 align-middle">
                <p>
                    <button
                        className="btn-default"
                        disabled={!buttonsEnabled}
                        name="fetchTwice"
                        onClick={fetchMessages}
                    >
                        Make two calls
                    </button>
                </p>
            </div>
        </div>
    );
}