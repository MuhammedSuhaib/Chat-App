import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/Theme-provider"
import { AuthWrapper } from "@/components/AuthWrapper";
import { UserMenu } from "@/components/AvatarDropdown";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: `<${APP_NAME}/>`,
  description: `A PWA chat app for <${APP_NAME}/>`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:text-white text-black`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="max-w-sm mx-auto space-y-4">
            <div className="flex justify-around items-center-safe">
              <Link href="/">
                <span className="flex flex-wrap justify-center text-2xl font-bold tracking-wide text-center leading-tight">
                  &lt;<span className="text-1xl text-purple-400">{APP_NAME}</span>/&gt;
                </span>
              </Link>
              <UserMenu />
            </div>
            <AuthWrapper>{children}</AuthWrapper>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
