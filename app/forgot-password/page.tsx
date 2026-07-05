"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";

import AuthCard from "@/components/auth/AuthCard";
import AuthMessage from "@/components/auth/AuthMessage";
import FormField from "@/components/auth/FormField";
import SubmitButton from "@/components/auth/SubmitButton";
import { authClient } from "@/lib/auth-client";
import {
  forgotPasswordSchema,
  getAuthErrorMessage,
} from "@/lib/validations/auth";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.requestPasswordReset({
        email: parsed.data.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (result.error) {
        setError(getAuthErrorMessage(result.error, "Unable to send reset email"));
        return;
      }

      setMessage(
        "If an account exists for that email, a password reset link has been sent.",
      );
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError, "Unable to send reset email"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Forgot password"
      description="Enter your email and we'll send you a reset link."
      footer={
        <Link href="/signin" className="font-medium text-neutral-900">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <AuthMessage type="error" message={error} /> : null}
        {message ? <AuthMessage type="success" message={message} /> : null}

        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />

        <SubmitButton loading={loading}>Send reset link</SubmitButton>
      </form>
    </AuthCard>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
