import React, {useCallback, useEffect, useState} from "react";
import AddBookForm from "./AddBookForm";
import BookList from "./BookList";
import {Book} from "./types.ts";
import {addBook, fetchBooks} from "./api/book-api.ts";

const BookLibrary: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [status, setStatus] = useState<string|null>();

    // on startup, load the book list
    useEffect(() => {
        setStatus(null);
        fetchBooks()
            .then(data => {
                setBooks(data);
                setStatus(`${data.length} Books loaded`);
            })
            .catch(e => {
                console.dir(e);
                setStatus(`Error loading books: ${JSON.stringify(e)}`);
            });
    }, []);

    const handleAddBook = useCallback(async (book: Book) => {
        try {
            setStatus(null);
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
            <BookList books={books} />
        </div>
    );
};

export default BookLibrary;