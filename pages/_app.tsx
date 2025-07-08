import type { AppProps } from "next/app";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextThemesProvider>
      <main className={`${fontSans.variable} ${fontMono.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </NextThemesProvider>
  );
}
