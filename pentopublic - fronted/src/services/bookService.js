const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`,
};

/**
 * Fetch all books with associated files.
 */
export async function fetchBooksWithFiles() {
  const response = await fetch("/api/books/with-all-files", { headers });
  if (!response.ok) throw new Error("Failed to fetch books with files");
  return response.json();
}

/**
 * Fetch top books.
 */
export async function fetchTopBooks() {
  const response = await fetch("/api/books/top", { headers });
  if (!response.ok) throw new Error("Failed to fetch top books");
  return response.json();
}

/**
 * Fetch recent books.
 */
export async function fetchRecentBooks() {
  const response = await fetch("/api/books/recent", { headers });
  if (!response.ok) throw new Error("Failed to fetch recent books");
  return response.json();
}

/**
 * Fetch free books.
 */
export async function fetchFreeBooks() {
  const response = await fetch("/api/books/free", { headers });
  if (!response.ok) throw new Error("Failed to fetch free books");
  return response.json();
}

/**
 * Fetch audible books.
 */
export async function fetchAudibleBooks() {
  const response = await fetch("/api/books/audible", { headers });
  if (!response.ok) throw new Error("Failed to fetch audible books");
  return response.json();
}

/**
 * Search books.
 * @param {string} query
 */
export async function searchBooks(query) {
  const response = await fetch(`/api/books/search?query=${encodeURIComponent(query)}`, { headers });
  if (!response.ok) throw new Error("Failed to search books");
  return response.json();
}

/**
 * Fetch a book by ID.
 * @param {string} id
 */
export async function fetchBookById(id) {
  const response = await fetch(`/api/books/${id}`, { headers });
  if (!response.ok) throw new Error("Failed to fetch book by ID");
  return response.json();
}

/**
 * Fetch all authors.
 */
export async function fetchAllAuthors() {
  const response = await fetch("/api/books/author", { headers });
  if (!response.ok) throw new Error("Failed to fetch authors");
  return response.json();
}

/**
 * Fetch books by a specific author.
 * @param {string} authorId
 */
export async function fetchBooksByAuthor(authorId) {
  const response = await fetch(`/api/books/author/${authorId}`, { headers });
  if (!response.ok) throw new Error("Failed to fetch books by author");
  return response.json();
}
