import { useEffect, useState } from "react";

import api from "../api/client";
import DashboardShell from "../components/DashboardShell";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import StatusBadge from "../components/StatusBadge";

export default function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [orders, setOrders] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [productsRes, cartRes, ordersRes] = await Promise.all([
        api.get("/products"),
        api.get("/cart"),
        api.get("/orders")
      ]);

      setProducts(productsRes.data.products);
      setCart(cartRes.data.cart);
      setOrders(ordersRes.data.orders);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load dashboard data.");
    }
  };

  useEffect(() => {
    load();

    const intervalId = window.setInterval(() => {
      load();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, []);

  const addToCart = async (productId) => {
    try {
      await api.post("/cart", { productId, quantity: 1 });
      setMessage("Product added to trial cart.");
      setError("");
      load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not add the product to cart.");
    }
  };

  const placeOrder = async () => {
    try {
      await api.post("/orders", { deliveryAddress });
      setMessage("Try & Buy order placed.");
      setDeliveryAddress("");
      setError("");
      load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not place the order.");
    }
  };

  const handleDecision = async (orderId, decision) => {
    try {
      await api.patch(`/orders/${orderId}/decision`, { decision });
      setMessage(`Order ${decision === "accept" ? "accepted" : "returned"}.`);
      setError("");
      load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not record your decision.");
    }
  };

  const total = cart.items.reduce(
    (sum, item) => sum + item.quantity * (item.product?.price || item.priceAtAdd || 0),
    0
  );

  return (
    <Layout>
      <DashboardShell
        title="Customer Dashboard"
        subtitle="Browse products, prepare a trial cart, place Try & Buy orders, and decide after OTP-verified delivery."
      >
        {message && (
          <div className="rounded-[1.5rem] border border-teal-300/30 bg-teal-500/10 p-4 text-sm text-teal-100">
            {message}
          </div>
        )}
        {error && (
          <div className="rounded-[1.5rem] border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-100">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="grid gap-6 md:grid-cols-2">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
          <div className="space-y-6">
            <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-semibold text-white">Trial Cart</h2>
              <div className="mt-5 space-y-4">
                {cart.items.length === 0 && <p className="text-sm text-slate-400">No products added yet.</p>}
                {cart.items.map((item) => (
                  <div key={item.product?._id || item._id} className="rounded-2xl bg-slate-900/70 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">{item.product?.name}</p>
                      <p className="text-sm text-slate-300">x{item.quantity}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">Rs. {item.product?.price || item.priceAtAdd}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                <input
                  value={deliveryAddress}
                  onChange={(event) => setDeliveryAddress(event.target.value)}
                  placeholder="Delivery address"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                />
                <button
                  onClick={placeOrder}
                  disabled={!cart.items.length}
                  className="w-full rounded-2xl bg-amber-300 px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Place Try & Buy Order · Rs. {total}
                </button>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-semibold text-white">My Orders</h2>
              <div className="mt-3">
                <button
                  onClick={load}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300"
                >
                  Refresh Orders
                </button>
              </div>
              <div className="mt-5 space-y-4">
                {orders.length === 0 && <p className="text-sm text-slate-400">No orders yet.</p>}
                {orders.map((order) => (
                  <div key={order._id} className="rounded-2xl bg-slate-900/70 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">Order #{order._id.slice(-6)}</p>
                        <p className="text-sm text-slate-400">
                          {order.items.length} items · Rider: {order.rider?.name || "Awaiting assignment"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <StatusBadge value={order.orderStatus} />
                        <StatusBadge value={order.deliveryStatus} />
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">
                      OTP: <span className="font-semibold text-amber-300">{order.otp?.code}</span>
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      Payment status: {order.payment.status}
                    </p>
                    {order.orderStatus === "Out for Trial" && (
                      <p className="mt-2 text-sm text-cyan-200">
                        Trial started. Please accept or return the product after checking it.
                      </p>
                    )}
                    {order.orderStatus === "Out for Trial" && (
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() => handleDecision(order._id, "accept")}
                          className="rounded-2xl bg-emerald-400 px-4 py-2 font-semibold text-slate-950"
                        >
                          Accept Product
                        </button>
                        <button
                          onClick={() => handleDecision(order._id, "return")}
                          className="rounded-2xl border border-rose-300/30 px-4 py-2 text-rose-200"
                        >
                          Return Product
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </DashboardShell>
    </Layout>
  );
}
