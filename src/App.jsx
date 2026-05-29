import "./App.css";
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

/**
 * Route-level code splitting via React.lazy().
 *
 * Each page is its own JS chunk — downloaded only when first visited.
 * Navbar, Footer, AuthContext, and ProtectedRoute stay in the main chunk
 * because they are needed on every page immediately.
 *
 * Note: AmountDistributionSimulator (33KB) is loaded inside Dashboard.jsx,
 * so it gets split automatically as part of the Dashboard chunk.
 *
 * jsPDF is dynamically imported inside the simulator at PDF-export time,
 * so it only loads when the user clicks Export — not on initial page load.
 */
const Login          = lazy(() => import("./pages/Login"));
const Signup         = lazy(() => import("./pages/Signup"));
const Dashboard      = lazy(() => import("./pages/Dashboard"));
const VerifyAccount  = lazy(() => import("./pages/VerifyAccount"));
const NotFound       = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container" data-theme="light">
          <Navbar />
          <main className="app-main">
            {/*
              Single Suspense boundary covering all routes.
              Loader is a lightweight spinner already in the main chunk.
            */}
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login"  element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Post-login verification gate — public, no auth wrapper */}
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

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* 404 fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
