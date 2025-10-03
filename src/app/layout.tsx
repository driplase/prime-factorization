import type { Metadata } from "next";
import { Ubuntu_Sans, Ubuntu_Sans_Mono } from "next/font/google";
import "./globals.css";

const ubuntuSans = Ubuntu_Sans({
  variable: "--font-ubuntu-sans",
  subsets: ["latin"],
});

const ubuntuSansMono = Ubuntu_Sans_Mono({
  variable: "--font-ubuntu-sans-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "prime factorization | pf.j0.si",
  description: "prime factorization tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ubuntuSans.variable} ${ubuntuSansMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
