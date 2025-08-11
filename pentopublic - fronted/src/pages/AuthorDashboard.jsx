import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Book, Upload, List, FileText, Image, AudioWaveform, Tag, Calendar } from "lucide-react";

// Import the actual services and context
import { useAuth } from "../context/AuthContext";
import { fetchAuthorBooks, uploadBook } from "../services/authorService";
import AuthorHeader from "@/components/Header/AuthorHeader";

// Category options (as requested)
const categoryOptions = [
  { id: 1, name: "Spiritual" },
  { id: 2, name: "Business" },
  { id: 3, name: "Travel" },
  { id: 4, name: "RomCom" },
  { id: 5, name: "Horror" },
  { id: 6, name: "Health & Wellness" },
  { id: 7, name: "Personality Development" },
  { id: 8, name: "Finance" },
  { id: 9, name: "Comedy" },
  { id: 10, name: "Thriller" },
  { id: 11, name: "Children & Kids" },
  { id: 12, name: "Science Fiction" },
  { id: 13, name: "Self-Help" },
  { id: 14, name: "History" },
  { id: 15, name: "Mystery" },
  { id: 16, name: "Biographies" },
  { id: 17, name: "Education" },
  { id: 18, name: "Philosophy" },
  { id: 19, name: "Poetry" },
  { id: 20, name: "Adventure" },
];

const AuthorDashboard = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    pdfPath: "",
    frontPageLink: "",
    isFree: true,
    isAudioBook: false,
    audioPath: "",
    categoryId: 1,
  });

  useEffect(() => {
    if (user?.userId) {
      fetchBooks();
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      const data = await fetchAuthorBooks(user.userId);
      setBooks(data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val =
      type === "checkbox"
        ? checked
        : name === "categoryId"
        ? Number(value)
        : value;

    setForm((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      authorId: user.userId,
    };

    try {
      await uploadBook(payload);
      setUploadSuccess("success");
      setForm({
        title: "",
        description: "",
        pdfPath: "",
        frontPageLink: "",
        isFree: true,
        isAudioBook: false,
        audioPath: "",
        categoryId: 1,
      });
      fetchBooks();
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (err) {
      setUploadSuccess("error");
      console.error(err);
      setTimeout(() => setUploadSuccess(null), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
        return "bg-green-900/30 border-green-500/50 text-green-300";
      case "rejected":
        return "bg-red-900/30 border-red-500/50 text-red-300";
      default:
        return "bg-yellow-900/30 border-yellow-500/50 text-yellow-300";
    }
  };

  const getStatusText = (status) => {
    return status || "Pending";
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-8 px-6">
      <AuthorHeader user={user} />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Author Dashboard
          </h1>
          <p className="text-slate-400 flex items-center justify-center gap-2">
            <Book className="h-5 w-5" />
            Welcome back, {user?.name || "Author"}!
          </p>
        </div>

        {/* Success/Error Messages */}
        {uploadSuccess === "success" && (
          <div className="bg-green-900/30 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg flex items-center space-x-2 mb-6 shadow-lg">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>Book uploaded successfully!</span>
          </div>
        )}

        {uploadSuccess === "error" && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg flex items-center space-x-2 mb-6 shadow-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>Upload failed. Please try again.</span>
          </div>
        )}

        {/* Upload Book Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Upload New Book
            </h2>
          </div>

          <div className="space-y-4">
            {/* Title and Cover Image */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-slate-300 text-sm font-medium mb-2">
                  <FileText className="h-4 w-4" />
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Enter book title"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-slate-300 text-sm font-medium mb-2">
                  <Image className="h-4 w-4" />
                  Cover Image URL
                </label>
                <input
                  type="url"
                  name="frontPageLink"
                  value={form.frontPageLink}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-slate-300 text-sm font-medium mb-2">
                <FileText className="h-4 w-4" />
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border rounded-lg border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                placeholder="Enter book description..."
              />
            </div>

            {/* PDF and Audio Links */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-slate-300 text-sm font-medium mb-2">
                  <FileText className="h-4 w-4" />
                  PDF Link
                </label>
                <input
                  type="url"
                  name="pdfPath"
                  value={form.pdfPath}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="https://example.com/book.pdf"
                />
              </div>
              {form.isAudioBook && (
                <div>
                  <label className="flex items-center gap-2 text-slate-300 text-sm font-medium mb-2">
                    <AudioWaveform className="h-4 w-4" />
                    Audio Link
                  </label>
                  <input
                    type="url"
                    name="audioPath"
                    value={form.audioPath}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="https://example.com/audiobook.mp3"
                  />
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-slate-300 text-sm font-medium mb-2">
                <Tag className="h-4 w-4" />
                Category
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg border-slate-700 bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFree"
                  checked={form.isFree}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span>Free Book</span>
              </label>
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="isAudioBook"
                  checked={form.isAudioBook}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span>Audio Book</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Upload className="h-5 w-5" />
              Upload Book
            </button>
          </div>
        </div>

        {/* Books List Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <List className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Uploaded Books
            </h2>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-12">
              <Book className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No books uploaded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">#</th>
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">Title</th>
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Uploaded
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book, index) => (
                    <tr key={book.bookId} className="border-b border-slate-800 hover:bg-slate-700/50 transition-colors">
                      <td className="py-4 px-2 text-slate-400">{index + 1}</td>
                      <td className="py-4 px-2 text-slate-100 font-medium">{book.title}</td>
                      <td className="py-4 px-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(book.status)}`}>
                          {getStatusText(book.status)}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-slate-400">
                        {book.uploadDate
                          ? new Date(book.uploadDate).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorDashboard;