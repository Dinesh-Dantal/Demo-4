import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardFooter, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { fetchBooksWithFiles, fetchTopBooks } from '@/services/bookService';
import Header from '@/layout/Header';
import Footer from '@/layout/Footer';
import { Badge } from '@/components/ui/badge';
import {
  CalendarDays, User, Heart, Eye, Play, Star
} from 'lucide-react';

const getDriveImageLink = (url) => {
  try {
    const match = url?.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match?.[1]) {
      const id = encodeURIComponent(match[1]);
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }
  } catch {}
  return '/fallback-image.png';
};

const ReaderDashboardSub = ({ userSubscription = 'free' }) => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [likedBooks, setLikedBooks] = useState(new Set());

  const loadBooks = async () => {
    try {
      const fetched = filter === 'top'
        ? await fetchTopBooks()
        : await fetchBooksWithFiles();

      let sorted = [...fetched];

      if (filter === 'recent') {
        sorted.sort((a, b) =>
          new Date(b.uploadDate || b.createdAt) -
          new Date(a.uploadDate || a.createdAt)
        );
      } else if (filter === 'free') {
        sorted = sorted.filter(b => b.isFree || b.price === 0);
      } else if (filter === 'audio') {
        sorted = sorted.filter(b => b.bookFiles?.[0]?.audioPath);
      }

      setBooks(sorted);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setSearch('');
    loadBooks();
  }, [filter]);

  const toggleLike = (bookId) => {
    setLikedBooks(prev => {
      const next = new Set(prev);
      next.has(bookId) ? next.delete(bookId) : next.add(bookId);
      return next;
    });
  };

  const filteredBooks = books.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">
      <Header search={search} setSearch={setSearch} setFilter={setFilter} />

      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            All Books ({filteredBooks.length})
          </h2>

          {filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <span className="w-16 h-16 mb-4">📚</span>
              <h3 className="text-xl font-semibold mb-2">
                No books found
              </h3>
              <p className="text-slate-400">Try adjusting search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
              {filteredBooks.map(book => {
                const file = book.bookFiles?.[0];
                const frontPage = file?.frontPageLink;
                const imageUrl = frontPage
                  ? getDriveImageLink(frontPage)
                  : '/fallback-image.png';
                const uploadDate = book.uploadDate
                  ? new Date(book.uploadDate).toLocaleDateString()
                  : 'Unknown';
                const id = book.bookId || book.id;
                const isLiked = likedBooks.has(id);
                const hasAudio = Boolean(file?.audioPath);
                const hasPdf = Boolean(file?.pdfPath);
                const isFreeBook = book.isFree || book.price === 0;
                const canAccess = true;

                return (
                  <Card
                    key={id}
                    className={`w-64 h-[540px] flex flex-col justify-between overflow-hidden bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-lg hover:shadow-purple-500/25 hover:-translate-y-2 transition-all duration-300 ${!canAccess ? 'opacity-60' : ''}`}
                  >
                    <div className="aspect-[3/4] w-full relative overflow-hidden bg-slate-700">
                      <img
                        src={imageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <CardContent className="flex flex-col flex-grow space-y-2 pt-5 px-5 pb-2">
                      <CardTitle className="text-base font-bold line-clamp-2 text-slate-100">
                        {book.title}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2 text-slate-400 leading-relaxed">
                        {book.description}
                      </CardDescription>

                      <div className="space-y-2 pt-2">
                        <div className="text-sm text-slate-300 flex items-center gap-2 bg-slate-700/50 rounded-full px-3 py-1.5">
                          <User className="w-4 h-4 text-indigo-400" />
                          <span className="font-medium">{book.author?.name || 'Unknown'}</span>
                        </div>
                        <div className="text-sm text-slate-300 flex items-center gap-2 bg-slate-700/50 rounded-full px-3 py-1.5">
                          <CalendarDays className="w-4 h-4 text-purple-400" />
                          <span>{uploadDate}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between items-center px-5 pb-5 pt-0">
                      <Badge className={`text-white text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-full shadow-md ${
                        isFreeBook 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      }`}>
                        <Star className="w-3 h-3" /> 
                        <span className="font-medium">{isFreeBook ? 'Free' : 'Premium'}</span>
                      </Badge>

                      <div className="flex items-center gap-2">
                        {hasPdf && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <button 
                                className={`p-2.5 rounded-full transition-all duration-200 ${
                                  canAccess 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:shadow-lg hover:scale-110' 
                                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                                }`}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </DialogTrigger>
                            {canAccess && (
                              <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-4 bg-slate-900 text-slate-100 border border-slate-700 rounded-xl">
                                <div className="flex flex-col h-full space-y-4">
                                  <div className="space-y-1">
                                    <h2 className="text-xl font-bold">{book.title}</h2>
                                    <p className="text-sm text-slate-400">{book.description}</p>
                                    <div className="flex items-center gap-1 text-sm text-slate-400">
                                      <User className="w-4 h-4" />
                                      <span>{book.author?.name || 'Unknown'}</span>
                                    </div>
                                  </div>
                                  <div className="flex-grow overflow-auto rounded-md">
                                    <iframe
                                      src={file.pdfPath.replace('/view?usp=sharing','/preview')}
                                      width="100%"
                                      height="500"
                                      title="PDF Preview"
                                      className="rounded-md"
                                      allow="autoplay"
                                    ></iframe>
                                  </div>
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>
                        )}

                        {hasAudio && !hasPdf && (
                          <button
                            className={`p-2.5 rounded-full transition-all duration-200 ${
                              canAccess 
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:scale-110' 
                                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                            }`}
                            onClick={() => {
                              if (canAccess) {
                                const a = new Audio(file.audioPath);
                                a.play();
                              }
                            }}
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          className={`p-2.5 rounded-full transition-all duration-200 ${
                            isLiked 
                              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:from-red-600 hover:to-pink-600 hover:scale-110' 
                              : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-red-500'
                          }`}
                          onClick={() => toggleLike(id)}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReaderDashboardSub;
