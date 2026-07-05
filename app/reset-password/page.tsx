"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

import AuthCard from "@/components/auth/AuthCard";
import AuthMessage from "@/components/auth/AuthMessage";
import FormField from "@/components/auth/FormField";
import SubmitButton from "@/components/auth/SubmitButton";
import { authClient } from "@/lib/auth-client";
import {
  getAuthErrorMessage,
  resetPasswordSchema,
} from "@/lib/validations/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Reset token is missing or invalid.");
      return;
    }

    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid password");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.resetPassword({
        newPassword: parsed.data.password,
        token,
      });

      if (result.error) {
        setError(getAuthErrorMessage(result.error, "Unable to reset password"));
        return;
      }

      router.push("/signin?reset=1");
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError, "Unable to reset password"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Reset password"
      description="Choose a new password for your account."
      footer={
        <Link href="/signin" className="font-medium text-neutral-900">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <AuthMessage type="error" message={error} /> : null}

        <FormField
          id="password"
          label="New password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
        />

        <FormField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          required
        />

        <SubmitButton loading={loading}>Update password</SubmitButton>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
