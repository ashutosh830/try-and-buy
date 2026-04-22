import { useEffect, useState } from "react";

import api from "../api/client";
import DashboardShell from "../components/DashboardShell";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  inventoryCount: "",
  images: ""
};

export default function VendorDashboard() {
  const [dashboard, setDashboard] = useState({
    products: [],
    orders: [],
    riders: [],
    stats: {}
  });
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  const load = async () => {
    const response = await api.get("/vendor/dashboard");
    setDashboard(response.data.dashboard);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    await api.post("/products", {
      ...form,
      price: Number(form.price),
      inventoryCount: Number(form.inventoryCount)
    });
    setForm(emptyForm);
    setMessage("Product saved.");
    load();
  };

  const deleteProduct = async (productId) => {
    await api.delete(`/products/${productId}`);
    setMessage("Product deleted.");
    load();
  };

  const assignRider = async (orderId, riderId) => {
    if (!riderId) {
      return;
    }
    await api.patch(`/vendor/orders/${orderId}/assign-rider`, { riderId });
    setMessage("Rider assigned.");
    load();
  };

  return (
    <Layout>
      <DashboardShell
        title="Vendor Dashboard"
        subtitle="Manage the live catalog, monitor inventory, watch incoming Try & Buy orders, and route deliveries to active riders."
        actions={[
          <div key="stats" className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
            {dashboard.stats.totalProducts || 0} products · {dashboard.stats.totalInventory || 0} units in stock
          </div>
        ]}
      >
        {message && (
          <div className="rounded-[1.5rem] border border-teal-300/30 bg-teal-500/10 p-4 text-sm text-teal-100">
            {message}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <form
            onSubmit={handleCreate}
            className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-2xl font-semibold text-white">Add product</h2>
            <div className="mt-5 grid gap-4">
              {Object.entries({
                name: "Product name",
                description: "Description",
                price: "Price",
                category: "Category",
                inventoryCount: "Inventory count",
                images: "Image URL or comma-separated URLs"
              }).map(([name, label]) => (
                <div key={name}>
                  <label className="mb-2 block text-sm text-slate-300">{label}</label>
                  {name === "description" ? (
                    <textarea
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                    />
                  ) : (
                    <input
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-2xl bg-amber-300 px-4 py-3 font-semibold text-slate-950">
              Save Product
            </button>
          </form>

          <div className="space-y-6">
            <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-semibold text-white">Inventory</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {dashboard.products.map((product) => (
                  <div key={product._id} className="rounded-2xl bg-slate-900/70 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="mt-1 text-sm text-slate-400">{product.category}</p>
                        <p className="mt-2 text-sm text-slate-300">Rs. {product.price}</p>
                        <p className="text-sm text-slate-300">Inventory: {product.inventoryCount}</p>
                      </div>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="rounded-full border border-rose-300/30 px-3 py-2 text-xs text-rose-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-semibold text-white">Incoming Orders</h2>
              <div className="mt-5 space-y-4">
                {dashboard.orders.map((order) => (
                  <div key={order._id} className="rounded-2xl bg-slate-900/70 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">Order #{order._id.slice(-6)}</p>
                        <p className="text-sm text-slate-400">
                          {order.user?.name} · {order.user?.phone}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <StatusBadge value={order.orderStatus} />
                        <StatusBadge value={order.deliveryStatus} />
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">
                      Delivery address: {order.deliveryAddress}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <select
                        defaultValue=""
                        onChange={(event) => assignRider(order._id, event.target.value)}
                        className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      >
                        <option value="">Assign rider</option>
                        {dashboard.riders.map((rider) => (
                          <option key={rider._id} value={rider._id}>
                            {rider.name} · {rider.vehicleNumber || rider.phone}
                          </option>
                        ))}
                      </select>
                    </div>
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
