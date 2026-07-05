import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return session;
}

export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbiddenResponse(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function validationErrorResponse(message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}
