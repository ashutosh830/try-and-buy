import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import RiderDashboard from "./RiderDashboard";
import UserDashboard from "./UserDashboard";
import VendorDashboard from "./VendorDashboard";

export default function DashboardRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center text-slate-300">Loading dashboard...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "user") {
    return <UserDashboard />;
  }

  if (user.role === "vendor" || user.role === "admin") {
    return <VendorDashboard />;
  }

  if (user.role === "rider") {
    return <RiderDashboard />;
  }

  return <Navigate to="/" replace />;
}
