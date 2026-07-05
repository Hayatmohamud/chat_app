"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Monitor,
  Moon,
  Palette,
  Sun,
  Trash2,
  UserRound,
  AlertTriangle,
} from "lucide-react";

import AuthMessage from "@/components/auth/AuthMessage";
import FormField from "@/components/auth/FormField";
import SubmitButton from "@/components/auth/SubmitButton";
import { authClient, useSession } from "@/lib/auth-client";
import { getAuthErrorMessage, updateProfileSchema } from "@/lib/validations/auth";
import { useTheme } from "@/components/providers/theme-provider";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
    if (session) {
      setName(session.user.name);
      setImage(session.user.image ?? "");
    }
  }, [isPending, session, router]);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const parsed = updateProfileSchema.safeParse({ name, image });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid profile data");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.updateUser({
        name: parsed.data.name,
        image: parsed.data.image || undefined,
      });

      if (result.error) {
        setError(getAuthErrorMessage(result.error, "Unable to update profile"));
        return;
      }

      setMessage("Profile updated successfully.");
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError, "Unable to update profile"));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setDeleteLoading(true);
    try {
      const res = await fetch("/api/user", { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete account");
      }
      await authClient.signOut();
      router.push("/signin");
    } catch {
      setError("Failed to delete account. Please try again.");
      setConfirmDelete(false);
    } finally {
      setDeleteLoading(false);
    }
  }

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--text-tertiary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 sticky top-0 z-10">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <Link
            href="/chat"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--bg-tertiary)]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-base font-bold text-[var(--text-primary)]">
            Settings
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {/* Profile section */}
        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6">
          <div className="mb-5 flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "var(--accent-light)" }}
            >
              <UserRound className="h-4 w-4 text-[var(--accent)]" />
            </div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Profile
            </h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {error && <AuthMessage type="error" message={error} />}
            {message && <AuthMessage type="success" message={message} />}

            <FormField
              id="settings-name"
              label="Display name"
              value={name}
              onChange={setName}
              required
            />

            <FormField
              id="settings-image"
              label="Avatar URL"
              value={image}
              onChange={setImage}
              placeholder="https://example.com/avatar.jpg"
            />

            <SubmitButton loading={loading}>Save profile</SubmitButton>
          </form>
        </section>

        {/* Theme section */}
        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6">
          <div className="mb-5 flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "var(--accent-light)" }}
            >
              <Palette className="h-4 w-4 text-[var(--accent)]" />
            </div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Appearance
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "light", label: "Light", icon: Sun },
              { id: "dark", label: "Dark", icon: Moon },
            ].map((option) => {
              const isActive = theme === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={toggleTheme}
                  className={`flex flex-col items-center gap-2.5 rounded-xl border p-4 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
                      : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-tertiary)]"
                  }`}
                >
                  <option.icon className="h-5 w-5" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Danger zone */}
        <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>
            <h2 className="text-base font-semibold text-red-400">
              Danger Zone
            </h2>
          </div>

          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            Permanently delete your account, all chat history, and generated
            images. This action{" "}
            <strong className="text-red-400">cannot be undone</strong>.
          </p>

          {confirmDelete && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-fade-in">
              <strong>Are you absolutely sure?</strong> Click again to confirm permanent deletion.
            </div>
          )}

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150 disabled:opacity-60 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #e17055 0%, #d63031 100%)" }}
          >
            {deleteLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {confirmDelete ? "Yes, delete everything" : "Delete Account"}
          </button>
        </section>
      </main>
    </div>
  );
}
