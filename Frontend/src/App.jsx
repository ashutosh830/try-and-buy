import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import DashboardRouter from "./pages/DashboardRouter";
import HomePage from "./pages/HomePage";

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center text-slate-300">Loading application...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/dashboard" element={<DashboardRouter />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
