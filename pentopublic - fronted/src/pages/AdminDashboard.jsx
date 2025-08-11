import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Moon, 
  Sun, 
  UserCheck, 
  UserX,
  BookCheck,
  BarChart3,
  RotateCw,
  AlertCircle,
  Calendar,
  LogOut,
  User,
  ChevronDown,
  Bell,
  Settings
} from 'lucide-react';

// Import adminService (this would be your actual service)
const adminService = {
  getDashboard: () => fetch('/api/admin/dashboard').then(res => res.json()),
  getPendingBooks: () => fetch('/api/admin/pending-books').then(res => res.json()),
  getReaders: () => fetch('/api/admin/readers').then(res => res.json()),
  getAuthors: () => fetch('/api/admin/authors').then(res => res.json()),
  getBooksSummary: () => fetch('/api/admin/books-summary').then(res => res.json()),
  approveBook: (bookId) => fetch(`/api/admin/books/${bookId}/approve`, { method: 'PUT' }).then(res => res.json()),
  rejectBook: (bookId) => fetch(`/api/admin/books/${bookId}/reject`, { method: 'PUT' }).then(res => res.json())
};

// These hooks would be imported from your actual context and router
// import { useAuth } from '@/context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// For demo purposes, these are placeholder functions that simulate the real behavior
const useAuth = () => ({
  user: { userName: "Admin User", role: "administrator" }, // This will be populated by your actual auth context
  logout: () => console.log("Logout function called")
});

const useNavigate = () => (path) => {
  console.log("Navigate to:", path);
  // In your real app, this would actually navigate to the route
  return true;
};

// AdminHeader Component
const AdminHeader = ({ darkMode, onToggleTheme, onRefresh, refreshing }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setDropdownOpen(false);
  };

  return (
    <header className="bg-slate-800/90 backdrop-blur-sm shadow-lg px-4 py-3 flex items-center justify-between sticky top-0 z-20 border-b border-slate-700/50">
      <div className="flex items-center space-x-6">
        <h1
          className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          onClick={() => navigate("/admin-dashboard")}
        >
          PenToPublic Admin 🛡️
        </h1>
        
        {/* Header Actions */}
        <div className="flex items-center space-x-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-200 ${refreshing ? 'opacity-50' : ''}`}
          >
            <RotateCw className={`h-4 w-4 text-slate-300 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-slate-300 text-sm font-medium hidden sm:block">
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-200"
          >
            {darkMode ? <Sun className="h-4 w-4 text-slate-300" /> : <Moon className="h-4 w-4 text-slate-300" />}
          </button>
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center gap-2 border rounded-full px-3 py-2 bg-slate-700/50 text-slate-100 hover:bg-slate-600/50 transition border-slate-600"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <User size={18} />
          <span className="font-medium">{user?.userName || 'Admin User'}</span>
          <ChevronDown size={16} />
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <p className="font-semibold text-slate-100">{user?.userName || 'Admin User'}</p>
                <p className="text-sm text-slate-400 capitalize">{user?.role || 'Administrator'}</p>
              </div>

              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-3 hover:bg-slate-700/50 flex items-center gap-2 text-slate-100"
              >
                <User size={16} className="text-slate-400" />
                <span>Your Profile</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/20 flex items-center gap-2"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

const AdminDashboard = () => {
  // UI State
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Data State
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingBooks, setPendingBooks] = useState([]);
  const [readers, setReaders] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [booksSummary, setBooksSummary] = useState([]);

  // Theme
  const theme = {
    bg: 'bg-slate-900',
    cardBg: 'bg-slate-800/50 backdrop-blur-sm',
    text: 'text-slate-100',
    textSecondary: 'text-slate-400',
    border: 'border-slate-700/50',
    hover: 'hover:bg-slate-700/30',
    accent: 'bg-slate-700/30',
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500',
    primaryHover: 'hover:from-blue-600 hover:to-purple-600'
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboard, pending, readers, authors, summary] = await Promise.allSettled([
        adminService.getDashboard(),
        adminService.getPendingBooks(),
        adminService.getReaders(),
        adminService.getAuthors(),
        adminService.getBooksSummary()
      ]);

      if (dashboard.status === 'fulfilled') {
        setDashboardData(dashboard.value);
      }
      if (pending.status === 'fulfilled') {
        setPendingBooks(pending.value || []);
      }
      if (readers.status === 'fulfilled') {
        setReaders(readers.value || []);
      }
      if (authors.status === 'fulfilled') {
        setAuthors(authors.value || []);
      }
      if (summary.status === 'fulfilled') {
        setBooksSummary(summary.value || []);
      }

      const failures = [dashboard, pending, readers, authors, summary]
        .filter(result => result.status === 'rejected');
      
      if (failures.length > 0) {
        console.warn('Some API calls failed:', failures);
        setError(`${failures.length} API endpoints failed to load`);
      }

    } catch (err) {
      console.error('Data fetch error:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Handle book approval
  const handleApprove = async (bookId) => {
    try {
      await adminService.approveBook(bookId);
      setPendingBooks(prev => prev.filter(book => book.id !== bookId));
      
      if (dashboardData?.books) {
        setDashboardData(prev => ({
          ...prev,
          books: {
            ...prev.books,
            pending: Math.max(0, (prev.books.pending || 0) - 1),
            approved: (prev.books.approved || 0) + 1
          }
        }));
      }
      
      showNotification('Book approved successfully', 'success');
    } catch (error) {
      showNotification('Failed to approve book: ' + error.message, 'error');
    }
  };

  // Handle book rejection
  const handleReject = async (bookId) => {
    try {
      await adminService.rejectBook(bookId);
      setPendingBooks(prev => prev.filter(book => book.id !== bookId));
      
      if (dashboardData?.books) {
        setDashboardData(prev => ({
          ...prev,
          books: {
            ...prev.books,
            pending: Math.max(0, (prev.books.pending || 0) - 1),
            rejected: (prev.books.rejected || 0) + 1
          }
        }));
      }
      
      showNotification('Book rejected successfully', 'success');
    } catch (error) {
      showNotification('Failed to reject book: ' + error.message, 'error');
    }
  };

  // Notification system
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Initialize
  useEffect(() => {
    fetchData();
  }, []);

  // Loading screen
  if (loading) {
    return (
      <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-700 border-t-blue-500 mx-auto mb-6 shadow-lg"></div>
          <h2 className={`text-2xl font-bold ${theme.text} mb-3`}>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Loading Admin Dashboard
            </span>
          </h2>
          <p className={`${theme.textSecondary} text-lg`}>Fetching data...</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (error && !dashboardData && pendingBooks.length === 0) {
    return (
      <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
          <h2 className={`text-2xl font-bold ${theme.text} mb-3`}>Connection Failed</h2>
          <p className={`${theme.textSecondary} mb-6 text-lg`}>{error}</p>
          <button
            onClick={fetchData}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Stats Card Component
  const StatCard = ({ icon: Icon, title, value, color, iconBg }) => (
    <div className={`${theme.cardBg} ${theme.border} rounded-xl shadow-lg border p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105`}>
      <div className="flex items-center space-x-4">
        <div className={`${iconBg} p-3 rounded-xl shadow-md`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div>
          <h3 className={`text-sm font-medium ${theme.textSecondary} uppercase tracking-wide mb-1`}>
            {title}
          </h3>
          <p className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
            {value !== null && value !== undefined ? value : '-'}
          </p>
        </div>
      </div>
    </div>
  );

  // Navigation Component
  const Navigation = () => (
    <div className={`${theme.cardBg} ${theme.border} rounded-xl shadow-lg border p-4 mb-6`}>
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'pending', label: `Pending Books (${pendingBooks.length})`, icon: Clock },
          { id: 'authors', label: `Authors (${authors.length})`, icon: UserCheck },
          { id: 'readers', label: `Readers (${readers.length})`, icon: Users },
          { id: 'summary', label: `Books (${booksSummary.length})`, icon: BookCheck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id 
                ? `${theme.primary} text-white shadow-lg transform scale-105` 
                : `${theme.text} ${theme.hover} shadow-md`
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Dashboard Content
  const DashboardContent = () => {
    if (!dashboardData) {
      return (
        <div className={`${theme.cardBg} ${theme.border} rounded-xl shadow-lg border p-12 text-center`}>
          <BarChart3 className={`h-20 w-20 ${theme.textSecondary} mx-auto mb-6`} />
          <h3 className={`text-xl font-bold ${theme.text} mb-3`}>No Dashboard Data</h3>
          <p className={`${theme.textSecondary} text-lg`}>Unable to load dashboard statistics</p>
        </div>
      );
    }

    const { books = {}, users = {} } = dashboardData;

    return (
      <div className="space-y-8">
        <div>
          <h2 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center`}>
            <BookOpen className="h-6 w-6 mr-3 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Book Statistics
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={BookOpen} title="Total Books" value={books.total} color="from-blue-400 to-blue-500" iconBg="bg-blue-500/20" />
            <StatCard icon={CheckCircle} title="Approved" value={books.approved} color="from-green-400 to-green-500" iconBg="bg-green-500/20" />
            <StatCard icon={Clock} title="Pending" value={books.pending} color="from-purple-400 to-purple-500" iconBg="bg-purple-500/20" />
            <StatCard icon={XCircle} title="Rejected" value={books.rejected} color="from-red-400 to-red-500" iconBg="bg-red-500/20" />
          </div>
        </div>

        <div>
          <h2 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center`}>
            <Users className="h-6 w-6 mr-3 text-purple-400" />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              User Statistics
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={UserCheck} title="Authors" value={users.authors} color="from-purple-400 to-purple-500" iconBg="bg-purple-500/20" />
            <StatCard icon={Users} title="Readers" value={users.readers} color="from-pink-400 to-pink-500" iconBg="bg-pink-500/20" />
            <StatCard icon={UserX} title="Subscribed" value={users.subscribedReaders} color="from-blue-400 to-blue-500" iconBg="bg-blue-500/20" />
          </div>
        </div>
      </div>
    );
  };

  // Pending Books Content
  const PendingBooksContent = () => (
    <div className={`${theme.cardBg} ${theme.border} rounded-xl shadow-lg border overflow-hidden`}>
      <div className="px-6 py-5 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-700">
        <h2 className={`text-2xl font-bold ${theme.text} flex items-center`}>
          <Clock className="h-6 w-6 mr-3 text-purple-400" />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Pending Book Approvals
          </span>
        </h2>
        <p className={`text-sm ${theme.textSecondary} mt-1`}>{pendingBooks.length} books awaiting review</p>
      </div>
      
      {pendingBooks.length === 0 ? (
        <div className="p-12 text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h3 className={`text-xl font-bold ${theme.text} mb-3`}>All Caught Up!</h3>
          <p className={`${theme.textSecondary} text-lg`}>No pending books to review</p>
        </div>
      ) : (
        <div className={`divide-y ${theme.border}`}>
          {pendingBooks.map((book) => (
            <div key={book.id} className={`p-6 ${theme.hover} transition-all duration-200`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${theme.text} mb-2`}>{book.title}</h3>
                  <p className={`${theme.textSecondary} mb-3 text-lg`}>by {book.author}</p>
                  {book.description && (
                    <p className={`text-sm ${theme.textSecondary} mb-4 leading-relaxed`}>{book.description}</p>
                  )}
                  <div className="flex items-center space-x-4">
                    {book.category && (
                      <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-semibold shadow-md">
                        {book.category}
                      </span>
                    )}
                    {book.submittedDate && (
                      <span className={`text-xs ${theme.textSecondary} flex items-center bg-slate-700/50 px-3 py-1 rounded-full`}>
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(book.submittedDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => handleApprove(book.id)}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleReject(book.id)}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Generic List Content
  const ListContent = ({ title, data, type, icon: Icon }) => (
    <div className={`${theme.cardBg} ${theme.border} rounded-xl shadow-lg border overflow-hidden`}>
      <div className="px-6 py-5 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-700">
        <h2 className={`text-2xl font-bold ${theme.text} flex items-center`}>
          <Icon className="h-6 w-6 mr-3 text-blue-400" />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
        <p className={`text-sm ${theme.textSecondary} mt-1`}>{data.length} {type} total</p>
      </div>
      
      <div className="p-6">
        {data.length === 0 ? (
          <div className="text-center py-12">
            <Icon className={`h-16 w-16 ${theme.textSecondary} mx-auto mb-6`} />
            <p className={`${theme.textSecondary} text-lg`}>No {type} found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={item.id || index} className={`p-5 rounded-lg ${theme.border} border ${theme.hover} transition-all duration-200 shadow-md hover:shadow-lg`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-bold text-lg ${theme.text}`}>
                      {item.name || item.title || `${item.firstName || ''} ${item.lastName || ''}`.trim() || `Item ${index + 1}`}
                    </h3>
                    <p className={`text-sm ${theme.textSecondary} mt-2`}>
                      {item.email || item.description || 'No additional information'}
                    </p>
                  </div>
                  {(item.status || item.isActive !== undefined) && (
                    <span className={`px-3 py-1 text-xs rounded-full font-semibold shadow-md ${
                      item.status === 'active' || item.isActive 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                        : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                    }`}>
                      {item.status || (item.isActive ? 'Active' : 'Inactive')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
      {/* Header */}
      <AdminHeader 
        darkMode={darkMode} 
        onToggleTheme={() => setDarkMode(!darkMode)}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Notification */}
      {notification && (
        <div className={`fixed top-24 right-6 z-50 p-5 rounded-lg shadow-2xl max-w-sm backdrop-blur-sm ${
          notification.type === 'success' ? 'bg-green-900/30 border border-green-500/50 text-green-300' :
          notification.type === 'error' ? 'bg-red-900/30 border border-red-500/50 text-red-300' :
          'bg-blue-900/30 border border-blue-500/50 text-blue-300'
        } transform transition-all duration-300 animate-pulse`}>
          <div className="flex items-center space-x-3">
            {notification.type === 'success' && <CheckCircle className="h-6 w-6" />}
            {notification.type === 'error' && <AlertCircle className="h-6 w-6" />}
            {notification.type === 'info' && <Bell className="h-6 w-6" />}
            <span className="text-sm font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Main Content Header */}
          <div className="mb-8">
            <h1 className={`text-4xl font-bold ${theme.text} mb-4`}>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dashboard Overview
              </span>
            </h1>
            <p className={`${theme.textSecondary} text-xl font-medium`}>Manage books and monitor platform activity</p>
            {error && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 text-red-300 rounded-lg text-sm shadow-md">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                {error}
              </div>
            )}
          </div>

          {/* Navigation */}
          <Navigation />

          {/* Content */}
          {activeTab === 'dashboard' && <DashboardContent />}
          {activeTab === 'pending' && <PendingBooksContent />}
          {activeTab === 'authors' && <ListContent title="Authors" data={authors} type="authors" icon={UserCheck} />}
          {activeTab === 'readers' && <ListContent title="Readers" data={readers} type="readers" icon={Users} />}
          {activeTab === 'summary' && <ListContent title="Books Summary" data={booksSummary} type="books" icon={BookCheck} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;