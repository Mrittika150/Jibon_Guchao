import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    }
    setBusy(false);
  }

  return (
    <div className="flex h-screen items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-3xl border border-line bg-card p-8 shadow-sm"
      >
        <h1 className="text-2xl font-bold">Jibon Guchao</h1>
        <p className="text-ink-soft">Sign in to see your day.</p>

        <label className="flex flex-col gap-1 font-semibold">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border border-line bg-page px-3 py-2 font-normal text-ink"
          />
        </label>

        <label className="flex flex-col gap-1 font-semibold">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-2xl border border-line bg-page px-3 py-2 font-normal text-ink"
          />
        </label>

        {error && (
          <p role="alert" className="rounded-2xl bg-card-soft px-3 py-2 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="rounded-2xl bg-pink px-3 py-2 font-bold text-on-pink transition-opacity disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}