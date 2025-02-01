import React, {useCallback, useEffect, useState} from "react";
import AddBookForm from "./AddBookForm";
import BookList from "./BookList";
import {Book} from "./types.ts";
import {addBookAsync, addBookAsyncUnwrapped, addBookPromises, fetchBooksPromise, fetchBooksAsync, fetchBooksAsyncUnwrapped, functionMode} from "./api/book-api.ts";

const BookLibrary: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [status, setStatus] = useState<string|null>();
    function doLoad() {
       switch (functionMode) {
            case 'promise': {
                fetchBooksPromise()
                    .then(data => {
                        setBooks(data);
                        setStatus(`${data.length} Books loaded`);
                    })
                    .catch(e => {
                        console.dir(e);
                        setStatus(`Error loading books: ${JSON.stringify(e)}`);
                    });
                break;
            }
            case 'async-unwrapped': {
                (async () => {
                    const books = await fetchBooksAsyncUnwrapped();
                    setBooks(books);
                    setStatus(`${books.length} Books loaded`);
                })();
                break;
            }
                break;
            case 'async': {
                (async () => {
                    const books = await fetchBooksAsync();
                    setBooks(books);
                    setStatus(`${books.length} Books loaded`);
                })();
                break;
            }

            default: {
                console.log('not configured.');
                break;
            }
        }
    }

    // on startup, load the book list
    useEffect(() => {
        setStatus(null);
        doLoad();


    }, []);

    const handleAddBook = useCallback((book: Book) => {
        switch (functionMode) {
            case 'promise':
                addBookPromises(book)
                .then(() => {
                    setStatus("Book added. Loading book list.");
                    fetchBooksPromise()
                        .then((data: Book[]) => {
                            setBooks(data);
                            setStatus(`${data.length} Books loaded`);
                        });
                })
                .catch(e => {
                    console.dir(e);
                    setStatus(`Error adding book: ${JSON.stringify(e)}`);
                });
                break;
            case 'async-unwrapped':
                (async () => {
                    try {
                        await addBookAsyncUnwrapped(book);
                        setStatus("Book added. Loading book list.");
                        const books = await fetchBooksAsyncUnwrapped();
                        setStatus(`${books.length} Books loaded`);
                        setBooks(books);
                    } catch (e) {
                        console.dir(e);
                        setStatus(`Error adding book: ${JSON.stringify(e)}`);
                    }
                })();
                break;
            case 'async':
                (async () => {
                    try {
                        await addBookAsync(book);
                        setStatus("Book added. Loading book list.");
                        const books = await fetchBooksAsync();
                        setStatus(`${books.length} Books loaded`);
                        setBooks(books);
                    } catch (e) {
                        console.dir(e);
                        setStatus(`Error adding book: ${JSON.stringify(e)}`);
                    }
                })();
                break;
        }
    }, []);

    // not sure if this really tests async quite enough - since it all appears to be a promise
    // probably explode this out and call three different methods with their own call semantics
    // TODO also add delays before resolving for each of these so we get more than scheduled task in parallel
    const raceToLoadBooks = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        for (let i = 0; i < 5; i++) {
            switch (functionMode) {
                case 'promise': {
                    setTimeout(() => {
                    // inline call and resolve 
                        fetchBooksPromise()
                        .then((response: Book[]) => {
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    setBooks(response)
                                    resolve(true);
                                }, 1000);
                            })
                        })
                    }, Math.random() * 3000);
                    // inline call and resolve 
                    break;
                }
                case 'async-unwrapped': {
                    (async() => {
                        setTimeout(async () => {
                            const data = await fetchBooksAsyncUnwrapped();
                            setBooks(data);
                            setStatus(`${data.length} Books loaded`);

                        }, Math.random() * 1000);
                    })();
                    break;
                }
                case 'async': {
                    (async() => {
                        setTimeout(async () => {
                            const data = await fetchBooksAsync();
                            setBooks(data);
                            setStatus(`${data.length} Books loaded`);
                        }, Math.random() * 1000);
                    })();
                    break;
                } 
                default: {
                    console.log('not configured.');
                }
            }
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
            <button onClick={raceToLoadBooks}>Race to load books</button>
        </div>
    );
};

export default BookLibrary;