import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Marketplace", to: "/" },
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" }
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-semibold tracking-[0.3em] text-amber-300">
            TRY & BUY
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            {user ? (
              <>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-slate-300">
                  {user.name} · {user.role}
                </span>
                <Link
                  to="/dashboard"
                  className="rounded-full bg-teal-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-teal-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-white/10 px-4 py-2 text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
                >
                  Logout
                </button>
              </>
            ) : (
              navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 transition ${
                      isActive
                        ? "bg-white text-slate-950"
                        : "border border-white/10 text-slate-300 hover:border-amber-300 hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
