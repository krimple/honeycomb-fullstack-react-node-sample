import React, {useEffect, useState} from "react";
import AddBookForm from "./AddBookForm";
import BookList from "./BookList";
import {context, SpanStatusCode, trace} from "@opentelemetry/api";

const tracer = trace.getTracer('trace-wrapper');

interface Book {
    isbn: string;
    name: string;
    description: string;
    publicationDate: string;
}
const BookLibrary: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);

    const span = tracer.startSpan('fetchBooks');

    // Fetch books from the backend
    const fetchBooks = async () => {
        return await context.with(trace.setSpan(context.active(), span), async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/books`);
                if (!response.ok) {
                    span.setStatus({
                        code: SpanStatusCode.ERROR,
                        message: response.statusText,
                    });
                }
                const data = await response.json();
                setBooks(data);
            } catch (error) {
                // @ts-expect-error error type unknown
                span.recordException(error);
                console.error(error);
            } finally {
                span.end();
            }
        });
    };

    // Add a new book to the backend
    const addBook = async (book: {
        isbn: string;
        name: string;
        description: string;
        publicationDate: string;
    }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/books`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(book),
            });

            if (!response.ok) {
                throw new Error(`Failed to add book: ${response.statusText}`);
            }

            const newBook = await response.json();
            setBooks((prevBooks) => [...prevBooks, newBook]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Library Management</h1>
            <AddBookForm onAddBook={addBook} />
            <BookList books={books} />
        </div>
    );
};

export default BookLibrary;