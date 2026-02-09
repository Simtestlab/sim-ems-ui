import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/modules/auth/context/AuthContext";
import { AppWrapper } from "@/components/AppWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Simtestlab EMS - Energy Management System",
  description: "Real-time energy monitoring and management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-white min-h-screen flex flex-col overflow-hidden`}>
          <AuthProvider>
            <AppWrapper>
              <div className="flex-1 overflow-auto py-0 no-scrollbar">{children}</div>
            </AppWrapper>
          </AuthProvider>
        </body>
    </html>
  );
}