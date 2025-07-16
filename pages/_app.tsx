import type { AppProps } from "next/app";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";

import { fontSans, fontMono } from "@/config/fonts";
import { AuthProvider as AuthModalProvider } from "@/components/auth/auth-provider";
import { AuthProvider } from "@/contexts/auth-context";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider>
        <AuthProvider>
          <main
            className={`${fontSans.variable} ${fontMono.variable} font-sans`}
          >
            <Component {...pageProps} />
            <AuthModalProvider />
          </main>
        </AuthProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
