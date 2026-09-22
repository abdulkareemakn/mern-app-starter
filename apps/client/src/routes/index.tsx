import type { MeResponse } from "@mern/shared";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { type FormEvent, useState } from "react";
import { authClient } from "#/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      const { data } = await axios.get<MeResponse>("/api/me");
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
      else setSignUp(false);
    } catch {
      setMessage("Unable to sign out. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12 sm:py-20">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl">MERN starter</h1>
          </CardTitle>
          <CardDescription>
            React · Express · MongoDB · TypeScript
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <p>Loading session…</p>
          ) : sessionError ? (
            <p role="alert" className="text-destructive">
              Cannot load your session. Check that the server is running, then
              reload.
            </p>
          ) : session ? (
            <section className="space-y-4">
              <h2 className="text-xl font-medium">
                Welcome, {session.user.name}
              </h2>
              <p className="text-muted-foreground">{session.user.email}</p>
              <div className="flex flex-wrap gap-3">
                <Button type="button" disabled={busy} onClick={checkApi}>
                  Test protected API
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={signOut}
                >
                  Sign out
                </Button>
              </div>
            </section>
          ) : (
            <section className="space-y-6">
              <h2 className="text-xl font-medium">
                {signUp ? "Create an account" : "Sign in"}
              </h2>
              <form className="space-y-4" onSubmit={submit}>
                {signUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      autoComplete="name"
                      required
                      maxLength={100}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={signUp ? "new-password" : "current-password"}
                    minLength={8}
                    maxLength={128}
                    required
                  />
                </div>
                <Button className="w-full" type="submit" disabled={busy}>
                  {busy
                    ? "Please wait…"
                    : signUp
                      ? "Create account"
                      : "Sign in"}
                </Button>
              </form>
              <Button
                type="button"
                variant="link"
                className="h-auto whitespace-normal px-0"
                disabled={busy}
                onClick={() => {
                  setSignUp(!signUp);
                  setMessage("");
                }}
              >
                {signUp
                  ? "Already registered? Sign in"
                  : "Need an account? Sign up"}
              </Button>
            </section>
          )}
        </CardContent>
        <CardFooter>
          <output
            className="block min-h-5 text-sm text-muted-foreground"
            aria-live="polite"
          >
            {message}
          </output>
        </CardFooter>
      </Card>
    </main>
  );
}
