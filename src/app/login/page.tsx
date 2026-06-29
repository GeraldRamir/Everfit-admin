"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import EverfitLogo from "@/components/EverfitLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Error al iniciar sesión.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-everfit-charcoal via-everfit-wine to-everfit-charcoal p-12 text-white lg:flex">
        <EverfitLogo />
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight">
            Gestiona Everfit
            <br />
            desde un solo lugar
          </h1>
          <p className="mt-4 max-w-md text-white/70">
            Solicitudes, notificaciones, contenido y catálogo — todo con el estilo Everfit by Mich.
          </p>
        </div>
        <p className="text-sm text-white/40">Everfit Admin · Panel interno</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-[#f3f4f6] p-6">
        <div className="w-full max-w-md rounded-[1.5rem] border border-gray-100 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="mb-8 lg:hidden">
            <EverfitLogo theme="light" />
          </div>
          <h2 className="font-display text-2xl font-bold text-everfit-charcoal">Iniciar sesión</h2>
          <p className="mt-2 text-sm text-gray-500">Accede al panel de administración</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  className="admin-input pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  className="admin-input pl-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <p className="text-sm text-everfit-orange">{error}</p>}

            <button type="submit" disabled={loading} className="btn-admin-primary w-full py-3">
              {loading ? "Entrando..." : "Entrar al panel"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
