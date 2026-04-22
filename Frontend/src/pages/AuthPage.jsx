import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const roleOptions = [
  { value: "user", label: "Customer" },
  { value: "vendor", label: "Vendor" },
  { value: "rider", label: "Rider" }
];

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register } = useAuth();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: searchParams.get("role") || "user",
    shopName: "",
    vehicleNumber: ""
  });

  const isRegister = mode === "register";

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login({
          email: formData.email,
          password: formData.password
        });
      }
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Request failed");
    }
  };

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-teal-300">
              {isRegister ? "Registration" : "Authentication"}
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-white">
              {isRegister ? "Join the Try & Buy workflow" : "Resume your workspace"}
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Customers browse and trial products, vendors manage their live catalog, and riders coordinate doorstep verification and customer decisions.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glow"
          >
            <div className="grid gap-5 md:grid-cols-2">
              {isRegister && (
                <>
                  <Field label="Full name" name="name" value={formData.name} onChange={handleChange} />
                  <Field label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                  <Field label="Address" name="address" value={formData.address} onChange={handleChange} />
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <Field label="Email" name="email" value={formData.email} onChange={handleChange} />
              <Field
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              {isRegister && formData.role === "vendor" && (
                <Field label="Shop name" name="shopName" value={formData.shopName} onChange={handleChange} />
              )}
              {isRegister && formData.role === "rider" && (
                <Field
                  label="Vehicle number"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                />
              )}
            </div>

            {error && (
              <p className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </p>
            )}

            <button className="mt-8 w-full rounded-2xl bg-amber-300 px-6 py-4 font-semibold text-slate-950 transition hover:bg-amber-200">
              {isRegister ? "Create Account" : "Login"}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}

function Field({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-teal-300"
      />
    </div>
  );
}
