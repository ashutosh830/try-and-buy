import { useEffect, useState } from "react";

import api from "../api/client";
import DashboardShell from "../components/DashboardShell";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";

const deliveryStatuses = ["Picked", "Out for Delivery", "At Customer Location"];

export default function RiderDashboard() {
  const [orders, setOrders] = useState([]);
  const [otpMap, setOtpMap] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const response = await api.get("/rider/dashboard");
      setOrders(response.data.orders);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load assigned deliveries.");
    }
  };

  useEffect(() => {
    load();

    const intervalId = window.setInterval(() => {
      load();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, []);

  const updateStatus = async (orderId, deliveryStatus) => {
    try {
      await api.patch(`/rider/orders/${orderId}/status`, { deliveryStatus });
      setMessage(`Status updated to ${deliveryStatus}.`);
      setError("");
      load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update delivery status.");
    }
  };

  const verifyOtp = async (orderId) => {
    try {
      await api.patch(`/rider/orders/${orderId}/verify-otp`, {
        otp: otpMap[orderId] || ""
      });
      setMessage("OTP verified and trial started.");
      setError("");
      setOtpMap((current) => ({
        ...current,
        [orderId]: ""
      }));
      load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "OTP verification failed.");
    }
  };

  const confirmDecision = async (orderId, decision) => {
    try {
      await api.patch(`/rider/orders/${orderId}/decision`, { decision });
      setMessage(`Customer decision marked as ${decision}.`);
      setError("");
      load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not record customer decision.");
    }
  };

  return (
    <Layout>
      <DashboardShell
        title="Rider Dashboard"
        subtitle="Track assigned deliveries, move each order through the route, verify the doorstep OTP, and confirm the final customer decision."
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

        <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold text-white">Assigned Deliveries</h2>
          <div className="mt-3">
            <button
              onClick={load}
              className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300"
            >
              Refresh Deliveries
            </button>
          </div>
          <div className="mt-5 grid gap-4">
            {orders.map((order) => (
              <div key={order._id} className="rounded-2xl bg-slate-900/70 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">Order #{order._id.slice(-6)}</p>
                    <p className="text-sm text-slate-400">
                      Customer: {order.user?.name} · {order.user?.address}
                    </p>
                    <p className="text-sm text-slate-400">
                      Vendor: {order.vendor?.shopName || order.vendor?.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge value={order.orderStatus} />
                    <StatusBadge value={order.deliveryStatus} />
                  </div>
                </div>

                {order.orderStatus === "Pending" && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {deliveryStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(order._id, status)}
                        className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}

                {order.orderStatus === "Pending" && !order.otp?.verifiedAt && (
                  <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4 md:flex-row">
                    <input
                      placeholder="Enter delivery OTP"
                      value={otpMap[order._id] || ""}
                      onChange={(event) =>
                        setOtpMap((current) => ({
                          ...current,
                          [order._id]: event.target.value
                        }))
                      }
                      className="flex-1 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                    />
                    <button
                      onClick={() => verifyOtp(order._id)}
                      className="rounded-2xl bg-amber-300 px-5 py-3 font-semibold text-slate-950"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}

                {order.orderStatus === "Out for Trial" && (
                  <p className="mt-4 text-sm text-cyan-200">
                    OTP verified. The order is now in the customer trial window.
                  </p>
                )}

                {order.orderStatus === "Out for Trial" && (
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => confirmDecision(order._id, "Accepted")}
                      className="rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950"
                    >
                      Accepted
                    </button>
                    <button
                      onClick={() => confirmDecision(order._id, "Returned")}
                      className="rounded-2xl border border-rose-300/30 px-4 py-3 text-rose-200"
                    >
                      Returned
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </DashboardShell>
    </Layout>
  );
}
