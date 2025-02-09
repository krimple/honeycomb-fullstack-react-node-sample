import React from "react";
import BookDetails from "./BookDetails";

interface Book {
  isbn: string;
  name: string;
  description: string;
  publicationDate: string;
}

interface BookListProps {
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold">Book List</h2>
      {!books || books?.length === 0 ? (
        <p>No books in the library.</p>
      ) : (
        <ul test-id="book-list" className="border rounded p-4">
          {books.map((book) => (
            <li key={book.isbn} className="my-2 p-2 border-b">
              <BookDetails book={book} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;