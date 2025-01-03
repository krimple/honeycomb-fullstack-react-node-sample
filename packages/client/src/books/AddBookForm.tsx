import React, { useState } from "react";
import {Book} from "./types.ts";

interface AddBookFormProps {
  onAddBook: (book: Book) => void;
}

const AddBookForm: React.FC<AddBookFormProps> = ({ onAddBook }) => {
  const [isbn, setIsbn] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [publicationDate, setPublicationDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBook({ isbn, name, description, publicationDate });
    setIsbn("");
    setName("");
    setDescription("");
    setPublicationDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="my-4 p-4 bg-gray-100 border rounded">
      <h2 className="text-xl font-semibold">Add a New Book</h2>
      <div className="my-2">
        <label className="block">ISBN:</label>
        <input
          type="text"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
      </div>
      <div className="my-2">
        <label className="block">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
      </div>
      <div className="my-2">
        <label className="block">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
      </div>
      <div className="my-2">
        <label className="block">Publication Date:</label>
        <input
          type="date"
          value={publicationDate}
          onChange={(e) => setPublicationDate(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Add Book
      </button>
    </form>
  );
};

export default AddBookForm;