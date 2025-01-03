import React, {useCallback, useEffect, useState} from "react";
import AddBookForm from "./AddBookForm";
import BookList from "./BookList";
import {Book} from "./types.ts";
import {addBook, fetchBooks} from "./book-api.ts";

const BookLibrary: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);

    // on startup, load the book list
    useEffect(() => {
        fetchBooks().then(data => setBooks(data));
    }, []);

    const handleAddBook = useCallback(async (book: Book) => {
        await addBook(book);
        const books = await fetchBooks();
        setBooks(books);
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Library Management</h1>
            <AddBookForm onAddBook={handleAddBook} />
            <BookList books={books} />
        </div>
    );
};

export default BookLibrary;