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
  CalendarDays, User, Heart, Eye, Play, Star, BookOpen
} from 'lucide-react';

const ReaderDashboard = ({ userSubscription = 'free' }) => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [likedBooks, setLikedBooks] = useState(new Set());
  
  const isSubscribed = userSubscription === 'premium' || userSubscription === 'subscribed';

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
          <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            All Books ({filteredBooks.length})
            {!isSubscribed && (
              <span className="ml-2 text-sm font-normal text-slate-400">
                - Subscribe for premium access
              </span>
            )}
          </h2>

          {filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <BookOpen className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                No books found
              </h3>
              <p className="text-slate-500">Try adjusting search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
              {filteredBooks.map(book => {
                const file = book.bookFiles?.[0];
                const uploadDate = book.uploadDate
                  ? new Date(book.uploadDate).toLocaleDateString()
                  : 'Unknown';
                const id = book.bookId || book.id;
                const isLiked = likedBooks.has(id);
                const hasAudio = Boolean(file?.audioPath);
                const hasPdf = Boolean(file?.pdfPath);
                const isFreeBook = book.isFree || book.price === 0;
                const canAccess = isSubscribed || isFreeBook;

                return (
                  <Card
                    key={id}
                    className={`w-64 flex flex-col overflow-hidden shadow-xl bg-slate-800 border-slate-700 group hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-2 transition-all duration-300 rounded-2xl ${!canAccess ? 'opacity-60' : ''}`}
                  >
                    {/* Icon Cover */}
                    <div className="h-48 w-full relative flex items-center justify-center bg-slate-700">
                      <BookOpen className="w-20 h-20 text-slate-400 group-hover:text-purple-400 transition-colors duration-300" />

                      {/* Premium Lock Overlay */}
                      {!canAccess && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                          <div className="bg-slate-800/90 border border-slate-600 rounded-lg p-3 flex flex-col items-center gap-1">
                            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">🔒</span>
                            </div>
                            <span className="text-xs font-semibold text-slate-300">Premium</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <CardContent className="flex flex-col flex-grow space-y-2 p-4">
                      <CardTitle className="text-base font-bold line-clamp-2 text-slate-100 group-hover:text-purple-400 transition-colors duration-300">
                        {book.title}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2 text-slate-400 leading-relaxed">
                        {book.description}
                      </CardDescription>

                      <div className="space-y-1.5 pt-1">
                        <div className="text-sm text-slate-400 flex items-center gap-2 bg-slate-700/50 rounded-full px-3 py-1">
                          <User className="w-4 h-4 text-blue-400" />
                          <span className="font-medium text-slate-300">{book.author?.name || 'Unknown'}</span>
                        </div>
                        <div className="text-sm text-slate-400 flex items-center gap-2 bg-slate-700/50 rounded-full px-3 py-1">
                          <CalendarDays className="w-4 h-4 text-purple-400" />
                          <span className="text-slate-300">{uploadDate}</span>
                        </div>
                      </div>
                    </CardContent>

                    {/* Footer */}
                    <CardFooter className="flex justify-between items-center p-4 mt-auto border-t border-slate-700/50">
                      <Badge className={`text-white text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-full shadow-md ${
                        isFreeBook 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      }`}>
                        <Star className="w-3 h-3" /> 
                        <span className="font-medium">{isFreeBook ? 'Free' : 'Premium'}</span>
                      </Badge>

                      <div className="flex items-center gap-2">
                        {/* PDF Viewer */}
                        {hasPdf && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <button 
                                className={`p-2.5 rounded-full shadow-lg transition-all duration-200 ${
                                  canAccess 
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-110' 
                                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                                }`}
                                onClick={(e) => {
                                  if (!canAccess) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    alert('Please subscribe to access premium books!');
                                  }
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </DialogTrigger>
                            {canAccess && (
                              <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-4 bg-slate-800 border-slate-700 text-slate-100">
                                <div className="flex flex-col h-full space-y-4">
                                  <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-slate-100">{book.title}</h2>
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

                        {/* Audio Player */}
                        {hasAudio && !hasPdf && (
                          <button
                            className={`p-2.5 rounded-full shadow-lg transition-all duration-200 ${
                              canAccess 
                                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 hover:shadow-xl hover:shadow-purple-500/25 transform hover:scale-110' 
                                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                            }`}
                            onClick={() => {
                              if (canAccess) {
                                const a = new Audio(file.audioPath);
                                a.play();
                              } else {
                                alert('Please subscribe to access premium books!');
                              }
                            }}
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}

                        {/* Like Button */}
                        <button
                          className={`p-2.5 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 ${
                            isLiked 
                              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/25 hover:from-red-600 hover:to-pink-600 hover:shadow-xl hover:shadow-red-500/25' 
                              : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-red-400'
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

export default ReaderDashboard;