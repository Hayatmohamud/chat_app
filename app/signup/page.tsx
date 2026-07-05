"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import AuthCard from "@/components/auth/AuthCard";
import AuthMessage from "@/components/auth/AuthMessage";
import FormField from "@/components/auth/FormField";
import SubmitButton from "@/components/auth/SubmitButton";
import { authClient } from "@/lib/auth-client";
import { getAuthErrorMessage, signUpSchema } from "@/lib/validations/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsed = signUpSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (result.error) {
        setError(
          getAuthErrorMessage(
            result.error,
            "Unable to create account. Check the database connection and try again.",
          ),
        );
        return;
      }

      router.push("/chat");
      router.refresh();
    } catch (submitError) {
      setError(
        getAuthErrorMessage(
          submitError,
          "Unable to create account. Check the database connection and try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Create your account"
      description="Join to save chat history and access all AI models."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold transition-colors hover:opacity-80"
            style={{ color: "var(--accent)" }}
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <AuthMessage type="error" message={error} />}

        <FormField
          id="signup-name"
          label="Full name"
          value={name}
          onChange={setName}
          placeholder="Jane Smith"
          autoComplete="name"
          required
        />

        <FormField
          id="signup-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <FormField
          id="signup-password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          required
        />

        <p className="text-xs text-[var(--text-tertiary)]">
          By creating an account you agree to our terms of service.
        </p>

        <div className="pt-1">
          <SubmitButton loading={loading}>Create account</SubmitButton>
        </div>
      </form>
    </AuthCard>
  );
}
