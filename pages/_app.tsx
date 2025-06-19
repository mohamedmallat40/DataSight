"use client";

import type { AppProps } from "next/app";

import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { I18nProvider } from "@react-aria/i18n";
import { Spinner } from "@heroui/spinner";
import { ToastProvider } from "@heroui/toast";

import { fontSans, fontMono } from "@/config/fonts";
import { useTranslations } from "@/hooks/use-translation";
import { Navbar } from "@/components/navbar";

import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState("en");

  const { t } = useTranslations();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner color="warning" label="Loading..." />
      </div>
    );
  }

  return (
    <I18nProvider locale={locale}>
      <HeroUIProvider navigate={router.push}>
        <ToastProvider />
        <Navbar setLocale={setLocale} />
        <Component {...pageProps} />
      </HeroUIProvider>
    </I18nProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
