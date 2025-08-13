import React, {useCallback, useEffect, useState} from "react";
import AddBookForm from "./AddBookForm";
import BookList from "./BookList";
import {Book} from "./types.ts";
import {addBookAsync, fetchBooksAsync} from "./api/book-api.ts";

const BookLibrary: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [status, setStatus] = useState<string|null>();
    const [error, setError] = useState<string|null>();

    // on startup, load the book list
    useEffect(() => {
        // IIFE, because, React
         (async() => {
            try {
            const books = await fetchBooksAsync();
            setBooks(books);
            setStatus(`${books.length} Books loaded`);
            } catch (e) {
                    console.dir(e);
                    setError(`Error loading books: ${JSON.stringify(e)}`);
            }
        })();
    }, []);

    const handleAddBook = useCallback(async (book: Book) => {
        try {
            setStatus(null);
            setError(null);
            console.log('got here')
            await addBookAsync(book);
            setStatus("Book added. Loading book list.");
            const books = await fetchBooksAsync();
            setStatus(`${books.length} Books loaded`);
            setBooks(books);
        } catch (e) {
            console.dir(e);
            setError(`Internal error adding book`);
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
            { error &&
                <p className="text-center border-2 text-red-600 border-red-600 mx-auto w-2/3 px-4 py-4 my-2">
                    {error}
                </p>
            }
            <AddBookForm onAddBook={handleAddBook} />
            <BookList books={books} />
        </div>
    );
};

export default BookLibrary;