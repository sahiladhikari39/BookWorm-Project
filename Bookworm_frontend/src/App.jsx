import { useEffect, useState } from "react";
import "./App.css";

import BookCard from "./components/BookCard";

function App() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

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

  return (
    <div>
      <h1>Total Books: {books.length}</h1>

      {books.map((book) => (
        <BookCard
          key={book.id}
          title={book.title}
          author={book.author}
          published_year={book.published_year}
        />
      ))}
    </div>
  );
}

export default App;
