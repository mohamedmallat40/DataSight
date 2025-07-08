import type { AppProps } from "next/app";

import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${fontSans.variable} ${fontMono.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  );
}
