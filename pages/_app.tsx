import type { AppProps } from "next/app";

import { NextUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";

import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider>
        <main className={`${fontSans.variable} ${fontMono.variable} font-sans`}>
          <Component {...pageProps} />
        </main>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
