import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SupabaseProvider from "@/components/providers/supabase-provider";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "StudyMind AI",
  description: "AI-powered study assistant for university students. Master your courses with intelligent summaries, flashcards, and tutoring.",
  openGraph: {
    images: ['/og-image.png'], // Placeholder for actual image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${sora.variable} ${dmSans.variable} font-sans antialiased bg-background text-foreground`}
      >
        <SupabaseProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#111118',
                color: '#F1F5F9',
                border: '1px solid #1E1E2E',
              },
            }}
          />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
