import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polyflow | Voice Feedback for Under-Resourced Languages",
  description: "Polyflow is a pre-seed AI speech feedback system built first for Haitian Creole speakers. Unlocking human potential by bridging the language gap for millions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        {children}
      </body>
    </html>
  );
}
