import { useEffect, useState } from "react";
import "./App.css";

import BookCard from "./components/BookCard";

function App() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    published_year: "",
    reading_status: "WANT_TO_READ",
  });
  const [editingBookId, setEditingBookId] = useState(null);

  async function getBooks() {
    try {
      const response = await fetch("http://127.0.0.1:8000/books/list/");
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBooks();
  }, []);

  if (loading) {
    return <h2>loading books ......</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const isEditing = editingBookId !== null;

    const url = isEditing
      ? `http://127.0.0.1:8000/books/list/${editingBookId}/`
      : "http://127.0.0.1:8000/books/list/";

    try {
      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          published_year: Number(formData.published_year),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save book");
      }

      const savedBook = await response.json();

      if (isEditing) {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === editingBookId ? savedBook : book,
          ),
        );
      } else {
        setBooks((prevBooks) => [...prevBooks, savedBook]);
      }

      setEditingBookId(null);

      setFormData({
        title: "",
        author: "",
        description: "",
        published_year: "",
        reading_status: "WANT_TO_READ",
      });
    } catch (error) {
      setError(error.message);
    }
  }

  function handleEdit(book) {
    setEditingBookId(book.id);

    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      published_year: book.published_year,
      reading_status: book.reading_status,
    });
  }

  async function handleDelete(bookId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/books/list/${bookId}/`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div>
      <h1>Total Books: {books.length}</h1>

      {books.map((book) => (
        <div key={book.id}>
          <BookCard
            title={book.title}
            author={book.author}
            published_year={book.published_year}
          />

          <button onClick={() => handleEdit(book)}>Edit</button>

          <button onClick={() => handleDelete(book.id)}>Delete</button>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Book title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Published year"
          value={formData.published_year}
          onChange={(e) =>
            setFormData({ ...formData, published_year: e.target.value })
          }
          required
        />

        <select
          value={formData.reading_status}
          onChange={(e) =>
            setFormData({ ...formData, reading_status: e.target.value })
          }
        >
          <option value="WANT_TO_READ">Want to Read</option>
          <option value="READING">Reading</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <button type="submit">
          {editingBookId !== null ? "Update Book" : "Add Book"}
        </button>

        {editingBookId !== null && (
          <button
            type="button"
            onClick={() => {
              setEditingBookId(null);
              setFormData({
                title: "",
                author: "",
                description: "",
                published_year: "",
                reading_status: "WANT_TO_READ",
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default App;
