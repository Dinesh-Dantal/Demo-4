import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.get('/books').then(res => setBooks(res.data));
    api.get('/books/top').then(res => setTopBooks(res.data));
    api.get('/books/recent').then(res => setRecentBooks(res.data));
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    const res = await api.get(`/books/search?title=${query}`);
    setBooks(res.data);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📚 Book Dashboard</h1>

      <div className="flex mb-6 gap-2">
        <input
          type="text"
          className="border rounded px-3 py-2 flex-1"
          placeholder="Search books by title..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSearch}>
          Search
        </button>
      </div>

      <Section title="Top Rated Books" books={topBooks} />
      <Section title="Recently Uploaded" books={recentBooks} />
      <Section title="All Books" books={books} />
    </div>
  );
};

const Section = ({ title, books }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {books.map(book => (
        <Link
          to={`/read/${book.bookId}`}
          key={book.bookId}
          className="p-4 border rounded hover:shadow"
        >
          <h3 className="font-bold">{book.title}</h3>
          <p className="text-sm text-gray-600">{book.description?.substring(0, 100)}...</p>
          <p className="text-xs text-gray-500 mt-1">{book.isFree ? 'Free' : 'Paid'} | {book.status}</p>
        </Link>
      ))}
    </div>
  </div>
);

export { Dashboard };

