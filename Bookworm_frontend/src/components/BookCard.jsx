
function BookCard({ book, onEdit, onDelete }) {

  const statusLabels = {
    WANT_TO_READ: "Want to Read",
    READING: "Currently Reading",
    COMPLETED: "Completed",
  };

  return (
    <article className="book-card">

      <div className="book-card-top">
        <span className={`status-badge ${book.reading_status.toLowerCase()}`}>
          {statusLabels[book.reading_status]}
        </span>

        <span className="book-year">
          {book.published_year}
        </span>
      </div>

      <div className="book-info">
        <h3>{book.title}</h3>
        <p className="book-author">By {book.author}</p>

        {book.description && (
          <p className="book-description">
            {book.description}
          </p>
        )}
      </div>

      <div className="book-actions">
        <button
          className="edit-btn"
          onClick={() => onEdit(book)}
        >
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(book.id)}
        >
          Delete
        </button>
      </div>

    </article>
  );
}

export default BookCard;
