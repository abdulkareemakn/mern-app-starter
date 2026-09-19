import type { MeResponse } from "@mern/shared";
import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const {
    data: session,
    isPending,
    error: sessionError,
  } = authClient.useSession();
  const [signUp, setSignUp] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    setBusy(true);
    setMessage("");
    try {
      const result = signUp
        ? await authClient.signUp.email({
            email,
            password,
            name: String(form.get("name")),
          })
        : await authClient.signIn.email({ email, password });
      if (result.error)
        setMessage(result.error.message ?? "Authentication failed.");
    } catch {
      setMessage("Unable to reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function checkApi() {
    setBusy(true);
    try {
      const response = await fetch("/api/me");
      if (!response.ok) throw new Error("Request failed");
      const data: MeResponse = await response.json();
      setMessage(`Protected API says hello to ${data.user.name}.`);
    } catch {
      setMessage("Unable to access the protected API. Try signing in again.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    setMessage("");
    try {
      const result = await authClient.signOut();
      if (result.error) setMessage(result.error.message ?? "Sign out failed.");
    } catch {
      setMessage("Unable to sign out. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-bold">MERN starter</h1>
        <p className="mt-2 text-slate-600">
          React · Express · MongoDB · TypeScript
        </p>
      </header>
      {isPending ? (
        <p>Loading session…</p>
      ) : sessionError ? (
        <p role="alert">
          Cannot load your session. Check that the server is running, then
          reload.
        </p>
      ) : session ? (
        <section className="space-y-4">
          <h2 className="text-xl">Welcome, {session.user.name}</h2>
          <p>{session.user.email}</p>
          <div className="flex gap-3">
            <button type="button" disabled={busy} onClick={checkApi}>
              Test protected API
            </button>
            <button type="button" disabled={busy} onClick={signOut}>
              Sign out
            </button>
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <h2 className="text-xl">
            {signUp ? "Create an account" : "Sign in"}
          </h2>
          <form className="space-y-4" onSubmit={submit}>
            {signUp && (
              <label className="block">
                Name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                />
              </label>
            )}
            <label className="block">
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label className="block">
              Password
              <input
                name="password"
                type="password"
                autoComplete={signUp ? "new-password" : "current-password"}
                minLength={8}
                maxLength={128}
                required
              />
            </label>
            <button type="submit" disabled={busy}>
              {busy ? "Please wait…" : signUp ? "Create account" : "Sign in"}
            </button>
          </form>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setSignUp(!signUp);
              setMessage("");
            }}
          >
            {signUp
              ? "Already registered? Sign in"
              : "Need an account? Sign up"}
          </button>
        </section>
      )}
      <output className="block" aria-live="polite">
        {message}
      </output>
    </main>
  );
}
