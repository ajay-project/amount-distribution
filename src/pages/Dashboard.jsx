import React from "react";
import AmountDistributionSimulator from "../components/AmountDistributionSimulator";
import "../styles/Dashboard.css";

/**
 * Dashboard wrapper page for the Amount Distribution Simulator.
 * Renders the fully functional simulator after routing.
 */
export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <AmountDistributionSimulator />
    </div>
  );
}
