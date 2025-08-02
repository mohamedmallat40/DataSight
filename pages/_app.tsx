import type { AppProps } from "next/app";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { fontSans, fontMono } from "@/config/fonts";
import { AuthProvider as AuthModalProvider } from "@/components/auth/auth-provider";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import "@/styles/globals.css";

function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && router.pathname === "/") {
      router.replace("/contacts");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Loading...</h1>
          <p className="text-default-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <main className={`${fontSans.variable} ${fontMono.variable} font-sans`}>
      <Component {...pageProps} />
      <AuthModalProvider />
    </main>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider
        disableTransitionOnChange
        enableSystem
        attribute="class"
        defaultTheme="system"
      >
        <AuthProvider>
          <AppContent Component={Component} pageProps={pageProps} />
        </AuthProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
