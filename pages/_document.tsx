import { Html, Head, Main, NextScript } from "next/document";
import clsx from "clsx";

import { fontSans } from "@/config/fonts";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link href="/favicon.ico" rel="icon" />

        {/* Core Metadata */}
        <meta charSet="UTF-8" />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
        <meta
          content="Perla Code Innovators (Perla CI, Perla IT, Perla Group) accelerates startup MVP development using cutting-edge web technology."
          name="description"
        />
        <meta
          content="Perla Code Innovators, Perla CI, Perla IT, Perla Group, startup studio, MVP, web development, Next.js, NestJS, TailwindCSS"
          name="keywords"
        />

        {/* Open Graph */}
        <meta content="Perla Code Innovators" property="og:title" />
        <meta
          content="Also known as Perla CI, Perla IT, or Perla Group — we deliver lightning-fast MVPs using modern technologies."
          property="og:description"
        />
        <meta content="/og-image.png" property="og:image" />
        <meta content="Perla Group" property="og:site_name" />
        <meta content="website" property="og:type" />
        <meta content="en_US" property="og:locale" />

        {/* Twitter */}
        <meta content="summary_large_image" name="twitter:card" />
        <meta content="Perla Code Innovators" name="twitter:title" />
        <meta
          content="Perla CI • Perla IT • Perla Group — Your tech partner for modern MVP development."
          name="twitter:description"
        />
        <meta content="/og-image.png" name="twitter:image" />

        {/* Theme */}
        <meta content="#ffffff" name="theme-color" />
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
