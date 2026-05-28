import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PendingApproval from "./components/PendingApproval";
import NotFound from "./pages/NotFound";
import VerifyAccount from "./pages/VerifyAccount";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container" data-theme="light">
          <Navbar />
          <main className="app-main">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Verification Route — public, no auth wrapper.
                  Handles the second DB call + approval check after login. */}
              <Route path="/verify-account" element={<VerifyAccount />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pending"
                element={
                  <ProtectedRoute>
                    <PendingApproval />
                  </ProtectedRoute>
                }
              />

              {/* Default Redirect to Dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Page Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
