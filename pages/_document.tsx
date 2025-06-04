import { Html, Head, Main, NextScript } from "next/document";
import clsx from "clsx";

import { fontSans } from "@/config/fonts";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Core Metadata */}
        <meta charSet="UTF-8" />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
        <meta
          name="description"
          content="Perla Code Innovators (Perla CI, Perla IT, Perla Group) accelerates startup MVP development using cutting-edge web technology."
        />
        <meta name="keywords" content="Perla Code Innovators, Perla CI, Perla IT, Perla Group, startup studio, MVP, web development, Next.js, NestJS, TailwindCSS" />

        {/* Open Graph */}
        <meta property="og:title" content="Perla Code Innovators" />
        <meta
          property="og:description"
          content="Also known as Perla CI, Perla IT, or Perla Group — we deliver lightning-fast MVPs using modern technologies."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:site_name" content="Perla Group" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Perla Code Innovators" />
        <meta
          name="twitter:description"
          content="Perla CI • Perla IT • Perla Group — Your tech partner for modern MVP development."
        />
        <meta name="twitter:image" content="/og-image.png" />

        {/* Theme */}
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
