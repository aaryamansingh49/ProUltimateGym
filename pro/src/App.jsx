import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

// Components
import ScrollToTop from "./components/dashboard/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import ChatBot from "./components/Chatbot";
import "./index.css";

// Admin imports
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPendingRenewals from "./pages/AdminPendingRenewals";

//workout
import TodayWorkout from "./pages/TodayWorkout";
import Meal from "./pages/Meal";
// import MyGoal from "./components/dashboard/MyGoal.jsx";
// import Statistics from "./components/dashboard/Statistics.jsx";

//UserDashboard
import ProtectedUserRoute from "./routes/ProtectedUserRoute";
import UserDashboard from "./pages/UserDashboard";

// Lazy loaded normal (user) pages
const Home = lazy(() => import("./components/Home"));
const About = lazy(() => import("./components/About"));
const Services = lazy(() => import("./components/Services"));
const Contact = lazy(() => import("./components/Contact"));
const Signup = lazy(() => import("./components/Signup"));
const Login = lazy(() => import("./components/Login"));
import Payments from "./pages/Payments";
import OtpLogin from "./pages/OtpLogin";

// Regular user components
// import UserDashboard from "./components/userDashboard.jsx";
import Membership from "./components/Membership.jsx";
import AccountStatement from "./components/AccountStatement.jsx";

//  Updated Conditional Components
function ConditionalNavbar({ setSidebarOpen }) {
  const { adminToken } = useAdminAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return adminToken && isAdminRoute
    ? null
    : <Navbar setSidebarOpen={setSidebarOpen} />;
}

function ConditionalFooter() {
  const { adminToken } = useAdminAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return adminToken && isAdminRoute ? null : <Footer />;
}

function ConditionalChatbot() {
  const { adminToken } = useAdminAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return adminToken && isAdminRoute ? null : <ChatBot />;
}

const App = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.email);
      } catch (error) {
        console.error("Invalid token");
        setUserEmail(null);
      }
    }
  }, []);

  return (
    <AdminAuthProvider>
      <Router>
        <ErrorBoundary>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
            }}
            containerStyle={{
              top: 100,
            }}
          />

          {/* Hide these for Admin */}
          <ConditionalNavbar setSidebarOpen={setSidebarOpen} />
          <ConditionalChatbot />

          <Suspense
            fallback={
              <div className="text-center p-8 text-lg font-semibold">
                Loading...
              </div>
            }
          >
            <ScrollToTop />

            <Routes>
              {/* ================= USER PUBLIC ROUTES ================= */}

              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/otp-login" element={<OtpLogin />} />

              <Route path="/workout/today" element={<TodayWorkout />} />
              <Route path="/meal" element={<Meal />} />

              {/* 🔥 REMOVE THESE (dashboard internal sections)
              <Route path="/my-goals" element={<MyGoal />} />
              <Route path="/statistics" element={<Statistics />} />
              */}

              <Route path="/membership" element={<Membership />} />

              <Route
                path="/account"
                element={<AccountStatement userEmail={userEmail} />}
              />

              {/* ================= PROTECTED USER DASHBOARD ================= */}

              <Route
                path="/dashboard"
                element={
                  <ProtectedUserRoute>
                    <UserDashboard
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />
                  </ProtectedUserRoute>
                }
              />

              {/* ================= ADMIN ROUTES ================= */}

              <Route path="/admin-login" element={<AdminLogin />} />

              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="/admin/payments"
                element={
                  <ProtectedAdminRoute>
                    <Payments />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="/admin/pending-renewals"
                element={
                  <ProtectedAdminRoute>
                    <AdminPendingRenewals />
                  </ProtectedAdminRoute>
                }
              />

              {/* ================= FALLBACK ================= */}

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>

          {/* Hide for admin */}
          <ConditionalFooter />
        </ErrorBoundary>
      </Router>
    </AdminAuthProvider>
  );
};

export default App;
