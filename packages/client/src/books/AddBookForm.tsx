import React, { useState } from "react";
import {Book} from "./types.ts";

interface AddBookFormProps {
  onAddBook: (book: Book) => void;
}
const currDate = () => { return new Date().toISOString().split('T')[0];}

const AddBookForm: React.FC<AddBookFormProps> = ({ onAddBook }) => {
 const [isbn, setIsbn] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [publicationDate, setPublicationDate] = useState(currDate());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isbn === 'blow up sir') {
      throw new Error('blowing up sir');
    }
    onAddBook({ isbn, name, description, publicationDate });
    setIsbn("");
    setName("");
    setDescription("");
    setPublicationDate(currDate());
  };

  return (
    <form onSubmit={handleSubmit} className="my-4 p-4 bg-gray-100 border rounded">
      <h2 className="text-xl font-semibold">Add a New Book</h2>
      <div className="my-2">
        <label className="block" htmlFor="isbn">ISBN:</label>
        <input
          name="isbn"
          type="text"
          test-id="isbn"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
      </div>
      <div className="my-2">
        <label className="block" htmlFor="name">Name:</label>
        <input
          name="name"
          type="text"
          test-id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
      </div>
      <div className="my-2">
        <label className="block" htmlFor="description">Description:</label>
        <textarea
          name="description"
          value={description}
          test-id="description"
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
      </div>
      <div className="my-2">
        <label className="block" htmlFor="publicationDate">Publication Date:</label>
        <input
          type="date"
          name="publicationDate"
          test-id="publicationDate"
          value={publicationDate}
          onChange={(e) => setPublicationDate(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
      </div>
      <button
          role="button"
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded">
        Add Book
      </button>
    </form>
  );
};

export default AddBookForm;