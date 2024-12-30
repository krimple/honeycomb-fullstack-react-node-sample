import React from "react";

interface Book {
  isbn: string;
  name: string;
  description: string;
  publicationDate: string;
}

interface BookDetailsProps {
  book: Book;
}

const BookDetails: React.FC<BookDetailsProps> = ({ book }) => {
  return (
    <div>
      <p><strong>ISBN:</strong> {book.isbn}</p>
      <p><strong>Name:</strong> {book.name}</p>
      <p><strong>Description:</strong> {book.description}</p>
      <p><strong>Publication Date:</strong> {book.publicationDate}</p>
    </div>
  );
};

export default BookDetails;