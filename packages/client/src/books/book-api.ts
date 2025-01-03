import {asyncTelemetryWrapper} from "../utils/asyncTelemetryWrapper.ts";
import {Book} from "./types.ts";

export const fetchBooks = async (): Promise<Book[]> => {
    return asyncTelemetryWrapper<Book[]>(async () => {
        const result = await fetch(`${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/books`)
        return result.json();
    }, 'fetchBooks');
}

export const addBook = async (book: Book) => {
    return asyncTelemetryWrapper<void>(async () => {
        const result = await fetch(`${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/books`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(book)
        });

        if (result.ok) {
            return;
        }
    }, 'addBook');
}
