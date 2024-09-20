import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://audio-compressor-tonejs-mit27.vercel.app/",
    siteName: "Audio Compressor",
    // images: [
    //   {
    //     url: "/og-image.png",
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
  },
  title: "Audio Compressor",
  description: "A web application that allows users to upload audio files and control the compression settings. Built with Tone.js and Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-sans",
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
