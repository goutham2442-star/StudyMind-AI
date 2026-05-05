import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";


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
  title: {
    default: "StudyMind AI — Academic Intelligence Platform",
    template: "%s | StudyMind AI"
  },
  description: "Transform your university study experience with AI-powered exam paper analysis, intelligent tutoring, and academic insights.",
  metadataBase: new URL("https://studymind-ai.com"),
  openGraph: {
    title: "StudyMind AI — Master Your University Exams",
    description: "The ultimate AI study companion for university students.",
    url: "https://studymind-ai.com",
    siteName: "StudyMind AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StudyMind AI Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyMind AI",
    description: "AI-powered academic intelligence for students.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
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
      </body>
    </html>
  );
}
