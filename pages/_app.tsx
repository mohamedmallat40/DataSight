import type { AppProps } from "next/app";

import { NextUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Add event listeners for auth modals
  useEffect(() => {
    const handleOpenLogin = () => {
      const event = new CustomEvent("triggerLogin");
      window.dispatchEvent(event);
    };

    const handleOpenRegister = () => {
      const event = new CustomEvent("triggerRegister");
      window.dispatchEvent(event);
    };

    window.addEventListener("openLogin", handleOpenLogin);
    window.addEventListener("openRegister", handleOpenRegister);

    return () => {
      window.removeEventListener("openLogin", handleOpenLogin);
      window.removeEventListener("openRegister", handleOpenRegister);
    };
  }, []);

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider>
        <AuthProvider>
          <main
            className={`${fontSans.variable} ${fontMono.variable} font-sans`}
          >
            <Component {...pageProps} />
          </main>
        </AuthProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

// Removed next-axiom dependency - not needed for this app
