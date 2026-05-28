import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader";
import AccessDenied from "../components/AccessDenied";
import PendingApproval from "../components/PendingApproval";

/**
 * ProtectedRoute — grants access to approved users.
 *
 * Since AuthContext initialises user/profile synchronously from localStorage
 * before the first render, route guards never show a flash of login/spinner
 * on refresh or back-button navigation.
 *
 * The spinner is shown ONLY when loading=true AND no user cached yet
 * (i.e. a genuine first-ever page load with no stored session).
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading } = useAuth();

  // Only block with spinner when genuinely loading with nothing cached
  if (loading && !user && !profile) {
    return <Loader message="Checking session..." />;
  }

  // No authenticated user at all → login
  if (!user && !profile) {
    return <Navigate to="/login" replace />;
  }

  // Profile not yet loaded (edge case) → redirect to login rather than verify-account loop
  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // Unapproved user
  if (!profile.approved) {
    return <PendingApproval />;
  }

  // Admin-only route check
  if (adminOnly && profile.role !== "admin") {
    return <AccessDenied />;
  }

  return children;
}
