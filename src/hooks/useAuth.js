import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook to use the AuthContext easily in components.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
