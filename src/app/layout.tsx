import { ConvexClientProvider } from "#/components/convex-provider";
import { ThemeProvider } from "#/components/theme-provider";
import "#/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "Notty - Write anywhere, edit everywhere",
  description:
    "Notty is a powerful note-taking application that helps you organize your thoughts, ideas, and tasks efficiently.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: ["note taking", "productivity", "organization", "tasks", "ideas"],
  authors: [{ name: "Ableez", url: "https://github.com/ableez" }],
  creator: "Ableez",
  publisher: "Ableez",
  openGraph: {
    title: "Notty - Smart Note Taking App",
    description:
      "Organize your thoughts, ideas, and tasks efficiently with Notty.",
    images: [{ url: "/og-image.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notty - Smart Note Taking App",
    description:
      "Organize your thoughts, ideas, and tasks efficiently with Notty.",
    images: ["/twitter-image.jpg"],
    creator: "@ableez",
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <html
          lang="en"
          className={`${geist.variable}`}
          suppressHydrationWarning
        >
          <body className="bg-orange-50 dark:bg-neutral-950">
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
            >
              {children}
            </ThemeProvider>
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
