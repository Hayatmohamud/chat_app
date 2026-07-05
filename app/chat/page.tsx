import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";
import Chat from "@/components/chat/chat";

export const metadata = {
  title: "Chat",
};

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }

  return <Chat userName={session.user.name} />;
}
