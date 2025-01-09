import {Book} from "../types.ts";
import {otelWrapperWithResponse} from "../../utils/otel/otelWrapperWithResponse.ts";
import {otelWrapper} from "../../utils/otel/otelWrapper.ts";
import {SpanStatusCode, trace} from "@opentelemetry/api";

const resourceEndpoint = `${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/books`;

// TODO: super cheapo dummy feature flag - use flagd later
const functionMode = import.meta.env.VITE_PUBLIC_FF_API_CALL_TYPE;

/**
 * Call either the async/await or promise-based fetch of books
 * based on the value in packages/client/.env
 */
export const fetchBooks = (): Promise<Book[]> => {
    if (functionMode === 'promise') {
       console.log('using promises')
        return fetchBooksPromise();
    } else {
        console.log('using async/await');
        return fetchBooksAsync();
    }
}

/**
 * We are wrapping an async function so the helper `otelWrapperWithResponse` here is
 * handling creating the span in the context, tracking the success/failure and updating
 * the span status/embedding the exception. This wrapper uses a generic type for the data
 * returned.
 */
async function fetchBooksAsync() : Promise<Book[]> {
    return otelWrapperWithResponse<Book[]>(async () => {
        const result = await fetch(resourceEndpoint);
        if (!result.ok) {
            throw new Error(result.statusText);
        }
        return await result.json() as Book[];
    }, 'fetchBooks');
}
/**
 * Note: in a promise auto-wrapped fetch, the error is reported by the instrumentation
 * and no span exists; you don't have to record the exception or set the state
 * of the span created by the fetch.
 *
 * @returns Promise<Book[]> the list of books
 */
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

/**
 * Call either the async/await or promise-based book add function
 * based on the value in packages/client/.env
 */
export const addBook = async (book: Book) => {
    // TODO - add this for both cases.  Currently only works for async calls because the fetch
    // starts the span for native promises and auto instrumentation... Could create a separate span,
    // exercise for later.
    const span =  trace.getActiveSpan();
    span?.setAttribute('app.api.call.type', functionMode || 'not configured');
    if (functionMode === 'promise') {
        return addBookPromises(book);
    } else {
        return addBookAsync(book);
    }
};

/**
 * Note: in a promise auto-wrapped fetch, the error is reported by the instrumentation
 * and no span exists. Therefore you don't have to record the exception and set the state
 * of the span created by the fetch.
 * @param book the book to persist
 */
function addBookPromises(book: Book) {
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
                console.dir(result);
                throw new Error(result.statusText || 'unknown error');
            }
        });

}

/**
 * Because you are wrapping an async function, you are responsible for creating the span, so we call
 * the `otelWrapper` helper function here, which creates a span and sets the status based on pass/fail.
 * @param book
 */
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
