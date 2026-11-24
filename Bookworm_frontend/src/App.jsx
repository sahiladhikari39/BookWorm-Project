import { useEffect, useMemo, useState } from "react";
import "./App.css";
import BookCard from "./components/BookCard";

const API_URL = "http://127.0.0.1:8000/books/list/";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [editingBookId, setEditingBookId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    published_year: "",
    reading_status: "WANT_TO_READ",
  });

  // Fetch all books
  async function getBooks() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch books.");
      }

      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBooks();
  }, []);

  // Handle form inputs
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  // Reset form
  function resetForm() {
    setFormData({
      title: "",
      author: "",
      description: "",
      published_year: "",
      reading_status: "WANT_TO_READ",
    });

    setEditingBookId(null);
  }

  // Add or update a book
  async function handleSubmit(e) {
    e.preventDefault();
    setActionError("");

    const payload = {
      ...formData,
      published_year: Number(formData.published_year),
    };

    const isEditing = editingBookId !== null;

    const url = isEditing
      ? `${API_URL}${editingBookId}/`
      : API_URL;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Object.values(data).flat().join(" ")
        );
      }

      if (isEditing) {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === editingBookId ? data : book
          )
        );
      } else {
        setBooks((prevBooks) => [data, ...prevBooks]);
      }

      resetForm();
    } catch (err) {
      setActionError(err.message);
    }
  }

  // Load selected book into form
  function handleEdit(book) {
    setEditingBookId(book.id);

    setFormData({
      title: book.title,
      author: book.author,
      description: book.description || "",
      published_year: book.published_year,
      reading_status: book.reading_status,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Delete a book
  async function handleDelete(bookId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    setActionError("");

    try {
      const response = await fetch(`${API_URL}${bookId}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book.");
      }

      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== bookId)
      );

      if (editingBookId === bookId) {
        resetForm();
      }
    } catch (err) {
      setActionError(err.message);
    }
  }

  // Dashboard statistics
  const stats = useMemo(() => ({
    total: books.length,
    reading: books.filter(
      (book) => book.reading_status === "READING"
    ).length,
    completed: books.filter(
      (book) => book.reading_status === "COMPLETED"
    ).length,
    wantToRead: books.filter(
      (book) => book.reading_status === "WANT_TO_READ"
    ).length,
  }), [books]);

  // Search and filter
  const filteredBooks = books.filter((book) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" ||
      book.reading_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Bookworm<span>.</span></h1>
          <p>Your personal reading space</p>
        </div>
      </header>

      <main className="container">

        {/* Dashboard */}
        <section className="dashboard">
          <div className="section-heading">
            <div>
              <h2>Your Dashboard</h2>
              <p>A little progress every day adds up.</p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>Total Books</span>
              <h2>{stats.total}</h2>
            </div>

            <div className="stat-card">
              <span>Currently Reading</span>
              <h2>{stats.reading}</h2>
            </div>

            <div className="stat-card">
              <span>Completed</span>
              <h2>{stats.completed}</h2>
            </div>

            <div className="stat-card">
              <span>Want to Read</span>
              <h2>{stats.wantToRead}</h2>
            </div>
          </div>
        </section>

        {/* Add/Edit Form */}
        <section className="form-section">
          <div className="section-heading">
            <div>
              <h2>{editingBookId ? "Edit Book" : "Add a New Book"}</h2>
              <p>
                {editingBookId
                  ? "Update your book details."
                  : "Add another book to your collection."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="book-form">

            <div className="form-grid">
              <div className="form-group">
                <label>Book Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter book title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Author</label>
                <input
                  type="text"
                  name="author"
                  placeholder="Enter author name"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Published Year</label>
                <input
                  type="number"
                  name="published_year"
                  placeholder="e.g. 2020"
                  value={formData.published_year}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Reading Status</label>
                <select
                  name="reading_status"
                  value={formData.reading_status}
                  onChange={handleChange}
                >
                  <option value="WANT_TO_READ">Want to Read</option>
                  <option value="READING">Currently Reading</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Write something about this book..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </div>

            {actionError && (
              <p className="error-message">{actionError}</p>
            )}

            <div className="form-actions">
              <button type="submit" className="primary-btn">
                {editingBookId ? "Update Book" : "Add Book"}
              </button>

              {editingBookId && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Books Section */}
        <section className="books-section">
          <div className="section-heading">
            <div>
              <h2>My Collection</h2>
              <p>Explore and manage your books.</p>
            </div>

            <span className="book-count">
              {filteredBooks.length} books
            </span>
          </div>

          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Books</option>
              <option value="WANT_TO_READ">Want to Read</option>
              <option value="READING">Currently Reading</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {loading ? (
            <p className="info-message">Loading your books...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : filteredBooks.length === 0 ? (
            <div className="empty-state">
              <h3>No books found</h3>
              <p>
                Try changing your search or add a new book to your collection.
              </p>
            </div>
          ) : (
            <div className="books-grid">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      <footer className="footer">
        <p>Bookworm © 2026 — Made for book lovers.</p>
      </footer>
    </div>
  );
}

export default App;
