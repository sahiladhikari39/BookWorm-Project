import { useEffect, useState } from "react";
import "./App.css";

import BookCard from "./components/BookCard";
import Counter from "./components/Counter";
import Status from "./components/Status";

function App() {
  const [books, setBooks] = useState([]);

  async function getBooks() {
    try {
      const response = await fetch("http://127.0.0.1:8000/books/list/");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div>
      <h1>Total Books: {books.length}</h1>

      {books.map(book => (
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
