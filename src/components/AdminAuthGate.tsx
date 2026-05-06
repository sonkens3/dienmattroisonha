"use client";

import { Lock, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

const ADMIN_EMAIL = "zsonken114@gmail.com";
const ADMIN_PASSWORD_HASH = "e228cdd4ec804a09ea93f44f7c398c3572bb97ba0f09c7f9350c11e9d7a96a54";
const ADMIN_AUTH_KEY = "sonha-admin-authenticated";

type AuthState = "checking" | "guest" | "authenticated";

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAuthState(localStorage.getItem(ADMIN_AUTH_KEY) === "1" ? "authenticated" : "guest");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await sha256(password);

    if (normalizedEmail === ADMIN_EMAIL && passwordHash === ADMIN_PASSWORD_HASH) {
      localStorage.setItem(ADMIN_AUTH_KEY, "1");
      setPassword("");
      setAuthState("authenticated");
    } else {
      setError("Email hoặc mật khẩu chưa đúng.");
    }

    setSubmitting(false);
  }

  function handleLogout() {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setAuthState("guest");
  }

  if (authState === "checking") {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 h-12 animate-pulse rounded bg-slate-100" />
      </div>
    );
  }

  if (authState !== "authenticated") {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-lg shadow-slate-950/5 sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-teal-700 text-white">
            <Lock size={22} aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-950">Đăng nhập admin</h1>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Nhập tài khoản quản trị để xem lead và chỉnh dự án thực tế.
            </p>
          </div>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="label" htmlFor="adminEmail">
              Email
            </label>
            <input
              id="adminEmail"
              type="email"
              className="field"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="adminPassword">
              Mật khẩu
            </label>
            <input
              id="adminPassword"
              type="password"
              className="field"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-800">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-teal-700 px-5 py-3 font-black text-white shadow-md transition hover:bg-teal-800 disabled:bg-slate-400"
          >
            <LogIn size={18} aria-hidden />
            {submitting ? "Đang kiểm tra..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-teal-100 bg-teal-50 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-teal-700 text-white">
            <ShieldCheck size={20} aria-hidden />
          </span>
          <div>
            <p className="font-black text-slate-950">Đã đăng nhập admin</p>
            <p className="text-sm text-slate-600">{ADMIN_EMAIL}</p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-teal-200 bg-white px-4 py-2 text-sm font-black text-teal-800 shadow-sm hover:border-teal-700"
          onClick={handleLogout}
        >
          <LogOut size={16} aria-hidden />
          Đăng xuất
        </button>
      </div>
      {children}
    </div>
  );
}

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
