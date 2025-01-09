import {Book} from "../types.ts";
import {otelWrapperWithResponse} from "../../utils/otel/otelWrapperWithResponse.ts";
import {otelWrapper} from "../../utils/otel/otelWrapper.ts";
import {SpanStatusCode, trace} from "@opentelemetry/api";

const resourceEndpoint = `${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/books`;

// TODO: super cheapo dummy feature flag - use flagd later
const functionMode = import.meta.env.VITE_PUBLIC_FF_API_CALL_TYPE;

export const fetchBooks = (): Promise<Book[]> => {
    if (functionMode === 'promise') {
       console.log('using promises')
        return fetchBooksPromise();
    } else {
        console.log('using async/await');
        return fetchBooksAsync();
    }
}

async function fetchBooksAsync() : Promise<Book[]> {
    return otelWrapperWithResponse<Book[]>(async () => {
        const result = await fetch(resourceEndpoint);
        if (!result.ok) {
            throw new Error(result.statusText);
        }
        return await result.json() as Book[];
    }, 'fetchBooks');
}

function fetchBooksPromise() : Promise<Book[]> {
    return new Promise((resolve, reject) => {
        fetch(resourceEndpoint)
            .then(result => {
                // result is ok only if  200 <= result <= 299
                if (!result.ok) {
                    // some sort of HTTP status code returned from server,
                    // treat as a logical error
                    throw new Error(result.statusText || 'unknown error');
                }
                // next promise in the chain returned by this statement
                return result.json();
            } )
            .then(books => resolve(books))
            .catch(e => {
                const span =  trace.getActiveSpan();
                debugger;
                span?.recordException(e);
                span?.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: 'message' in e ? e.getMessage() : 'unknown error'
                });
                // of course tell the console...
                console.error(e);
                reject(e);
            });
    });
}

export const addBook = async (book: Book) => {
    const span =  trace.getActiveSpan();
    span?.setAttribute('app.api.call.type', functionMode || 'not configured');
    if (functionMode === 'promise') {
        return addBookPromises(book);
    } else {
        return addBookAsync(book);
    }
};

function addBookPromises(book: Book) {
    const span = trace.getActiveSpan();
    return fetch(`${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/books`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        // TODO - camel case to snake case field mapping - should be a mapping in the server side
        // perhaps - noting it here because we are sending snake case downstream
        body: JSON.stringify(book)
    })
        .then(result => {
            // fetch doesn't throw errors for statuses < 500
            // so you have to interrogate the result
            if (!result.ok) {
                throw new Error(result.statusText || 'unknown error');
            }
        })
        .catch(e => {
            span?.setStatus({
                code: SpanStatusCode.ERROR,
                message: 'message' in e ? e.getMessage() : 'unknown error'
            })
            span?.recordException(e);
            throw e;
        });
}

async function addBookAsync(book: Book) {
    return otelWrapper(async () => {
        try {
            const result = await fetch(`${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/books`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                // TODO - camel case to snake case field mapping - should be a mapping in the server side
                // perhaps - noting it here because we are sending snake case downstream
                body: JSON.stringify(book)
            });

            if (!result.ok) {
                throw new Error(result.statusText);
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }, 'addBook');
}
