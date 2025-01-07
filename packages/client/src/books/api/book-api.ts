import {Book} from "../types.ts";
import {otelWrapperWithResponse} from "../../utils/otel/otelWrapperWithResponse.ts";
import {otelWrapper} from "../../utils/otel/otelWrapper.ts";

const resourceEndpoint = `${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/books`;

// TODO: super cheapo dummy feature flag - use flagd later
const functionMode = import.meta.env.VITE_PUBLIC_FF_API_CALL_TYPE;

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
    return otelWrapperWithResponse<Book[]>(async () => {
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
    if (functionMode === 'promise') {
        console.log('using promises')
        return addBookPromises(book);
    } else {
        console.log('using async/await');
        return addBookAsync(book);
    }
};

function addBookPromises(book: Book) {
    return fetch(`${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/books`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        // TODO - camel case to snake case field mapping - should be a mapping in the server side
        // perhaps - noting it here because we are sending snake case downstream
        body: JSON.stringify(book)
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

            if (result.ok) {
                return;
            } else {
                alert(result.statusText);
                return Promise.reject(result.statusText);
            }
        } catch (e) {
            alert(JSON.stringify(e));
            console.log(e);
        }
    }, 'addBook');
}
