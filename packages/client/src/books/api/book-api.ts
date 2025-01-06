import {asyncTelemetryWrapper} from "../../utils/asyncTelemetryWrapper.ts";
import {Book} from "../types.ts";
import {client} from "../../utils/feature-flags/flagdClient.ts";

const resourceEndpoint = `${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/books`;

// TODO - install streaming API to update when flags change
const functionMode = client.getStringValue('functionMode', 'unknown');
console.log(functionMode);

export const fetchBooks = (): Promise<Book[]> => {
    // hoping for auto instrumentation
    if (functionMode === 'promise') {
        console.log('using promises')
        return fetchBooksPromise()
    } else {
        console.log('using async/await');
        return fetchBooksAsync();
    }
}

async function fetchBooksAsync() : Promise<Book[]> {
    return asyncTelemetryWrapper<Book[]>(async () => {
        const result = await fetch(resourceEndpoint);
        return await result.json() as Book[];
    }, 'fetchBooks');
}

function fetchBooksPromise() : Promise<Book[]> {
    return new Promise((resolve, reject) => {
        fetch(resourceEndpoint)
            .then(result => { return result.json() } )
            .then(books => resolve(books))
            .catch(e => {
                console.log(e);
                reject(e);
            });
    });
}

export const addBook = async (book: Book) => {
    return asyncTelemetryWrapper<void>(async () => {
        const result = await fetch(`${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/books`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            // TODO - camel case to snake case field mapping - should be a mapping in the server side
            // perhaps - noting it here because we are sending snake case downstream
            body: JSON.stringify(book)
        });

        if (result.ok) {
            return;
        }
    }, 'addBook');
}
