"use client";

import Link from "next/link";
import { LogOut, Settings, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient, useSession } from "@/lib/auth-client";

export default function UserNav() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/signin");
    router.refresh();
  }

  if (isPending) {
    return (
      <div className="h-9 w-24 animate-pulse rounded-lg bg-neutral-200" />
    );
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/signin"
          className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 sm:flex">
        <UserRound className="h-4 w-4" />
        <span>{session.user.name}</span>
      </div>
      <Link
        href="/settings"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100"
        title="Settings"
      >
        <Settings className="h-4 w-4" />
      </Link>
      <button
        type="button"
        onClick={() => void handleSignOut()}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100"
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
