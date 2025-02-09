import React, {Suspense, useCallback, useEffect, useState} from "react";
import AddBookForm from "./AddBookForm";
import BookList from "./BookList";
import {Book} from "./types.ts";
import {addBook, fetchBooks} from "./api/book-api.ts";

const BookLibrary: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [status, setStatus] = useState<string|null>();
    async function doLoad() {
            const books = await fetchBooks();
            setTimeout(() => {
                setBooks(books);
                setStatus(`${books.length} Books loaded`);
            }, 6500);
    }

    // on startup, load the book list
    useEffect(() => {
        (async () => {
            setStatus(null);
            await doLoad();
        })();
    }, []);

    const handleAddBook = useCallback(async (book: Book) => {
        try {
            await addBook(book);
            setStatus("Book added. Loading book list.");
            const books = await fetchBooks();
            setStatus(`${books.length} Books loaded`);
            setBooks(books);
        } catch (e) {
            console.dir(e);
            setStatus(`Error adding book: ${JSON.stringify(e)}`);
        }
    }, []);

    // not sure if this really tests async quite enough - since it all appears to be a promise
    // probably explode this out and call three different methods with their own call semantics
    // TODO also add delays before resolving for each of these so we get more than scheduled task in parallel
    const raceToLoadBooks = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        for (let i = 0; i < 5; i++) {
            setTimeout(async () => {
                const data = await fetchBooks();
                setBooks(data);
                setStatus(`${data.length} Books loaded`);

            }, Math.random() * 1000);
        }
    }, []);

    return (
        <div className="p-4">
                <h1 className="text-2xl font-bold text-center">Library Management</h1>
                <hr className="underline"></hr>
                { status &&
                    <p className="text-center border-2 text-black border-black mx-auto w-2/3 px-4 py-4 my-2">
                        {status}
                    </p>
                }
                <AddBookForm onAddBook={handleAddBook} />
                <Suspense fallback={<div>Loading...</div>}>
                <BookList books={books} />
                </Suspense>
                <button onClick={raceToLoadBooks}>Race to load books</button>
        </div>
    );
};

export default BookLibrary;