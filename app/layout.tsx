import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mentorship Chat — AI Assistant",
    template: "%s | Mentorship Chat",
  },
  description:
    "A production-ready AI chat application powered by OpenRouter. Chat with Gemma, Llama, Mistral, Qwen, and DeepSeek — all for free.",
  keywords: ["AI chat", "ChatGPT alternative", "OpenRouter", "free AI models"],
  authors: [{ name: "Mentorship Chat" }],
  creator: "Mentorship Chat",
  openGraph: {
    type: "website",
    title: "Mentorship Chat — AI Assistant",
    description: "Chat with top AI models for free via OpenRouter.",
    siteName: "Mentorship Chat",
  },
  robots: { index: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
