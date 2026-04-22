import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/client";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/products").then((response) => setProducts(response.data.products));
  }, []);

  const addToCart = async (productId) => {
    if (!user || user.role !== "user") {
      setMessage("Please sign in as a customer to add items to the trial cart.");
      return;
    }

    await api.post("/cart", { productId, quantity: 1 });
    setMessage("Added to cart.");
  };

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glow">
            <p className="text-xs uppercase tracking-[0.35em] text-teal-300">Trial Commerce</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight text-white">
              Bring home the product first. Decide after the doorstep experience.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
              Customers place Try & Buy orders, vendors manage inventory and assignments, and riders complete OTP-based delivery handoff before payment gets captured.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-200"
              >
                {user ? "Open Dashboard" : "Create Account"}
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:border-teal-300"
              >
                Sign In
              </Link>
            </div>
            {message && (
              <p className="mt-6 rounded-2xl border border-teal-300/30 bg-teal-500/10 px-4 py-3 text-sm text-teal-100">
                {message}
              </p>
            )}
          </div>
          <div className="grid gap-4">
            {[
              "OTP verified handoff",
              "Payment captured only after acceptance",
              "Vendor and rider dashboards",
              "Inventory-aware trial ordering"
            ].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Feature</p>
                <p className="mt-3 text-lg text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-teal-300">Catalog</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Available Try & Buy products</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={user?.role === "user" ? addToCart : null}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}
