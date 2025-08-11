import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Header/Layout";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Unauthorized from "./pages/Unauthorized";
import Subscription from "./pages/Subscription";
import ReaderDashboard from "./components/Book/ReaderDashboard";
import AuthorDashboard from "./pages/AuthorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import AuthRouting from "./routes/AuthRouting";
import LandingPage from "./pages/LandingPage";
import VerifyOtp from "./components/Auth/VerifyOtp";
import ResetPassword from "./components/Auth/ResetPassword";
import About from "./Header/About";
import Contact from "./Header/Contact";
import ReaderDashboardSub from "./components/Book/ReaderDashboardSub";
import PaymentPage from "./pages/PaymentPage";

function App() {
  return (
    <Router>
  <Routes>

    {/* Routes with Header (Layout) */}
    <Route element={<Layout />}>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
<Route path="/reader" element={<ReaderDashboardSub />} />
<Route path="/payment" element={<PaymentPage />} />
      {/* Protected Dashboard Pages */}
      <Route
        path="/reader-dashboard"
        element={
          <AuthRouting allowedRoles={["reader"]}>
            <ReaderDashboard />
          </AuthRouting>
        }
      />
      <Route
        path="/author-dashboard"
        element={
          <AuthRouting allowedRoles={["author"]}>
            <AuthorDashboard />
          </AuthRouting>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <AuthRouting allowedRoles={["admin"]}>
            <AdminDashboard />
          </AuthRouting>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthRouting allowedRoles={["reader", "author", "admin"]}>
            <Profile />
          </AuthRouting>
        }
      />
    </Route>

    {/* Routes WITHOUT Header */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/verify-otp" element={<VerifyOtp />} />
    <Route path="/reset-password" element={<ResetPassword />} />

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/" replace />} />

  </Routes>
</Router>

  );
}

export default App;
