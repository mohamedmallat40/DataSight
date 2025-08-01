import { Html, Head, Main, NextScript } from "next/document";
import clsx from "clsx";

import { fontSans } from "@/config/fonts";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href="/favicon.ico" rel="icon" />
        <meta charSet="UTF-8" />
        <meta
          content="Perla Code Innovators (Perla CI, Perla IT, Perla Group) accelerates startup MVP development using cutting-edge web technology."
          name="description"
        />
        <meta
          content="Perla Code Innovators, Perla CI, Perla IT, Perla Group, startup studio, MVP, web development, Next.js, NestJS, TailwindCSS"
          name="keywords"
        />
        <meta content="Perla Code Innovators" property="og:title" />
        <meta
          content="Also known as Perla CI, Perla IT, or Perla Group — we deliver lightning-fast MVPs using modern technologies."
          property="og:description"
        />
        <meta content="/og-image.png" property="og:image" />
        <meta content="Perla Group" property="og:site_name" />
        <meta content="website" property="og:type" />
        <meta content="en_US" property="og:locale" />
        <meta content="summary_large_image" name="twitter:card" />
        <meta content="Perla Code Innovators" name="twitter:title" />
        <meta
          content="Perla CI • Perla IT • Perla Group — Your tech partner for modern MVP development."
          name="twitter:description"
        />
        <meta content="/og-image.png" name="twitter:image" />
        <meta content="#ffffff" name="theme-color" />
      </Head>
      <body
        suppressHydrationWarning
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.classList.toggle('dark', theme === 'dark');
              } catch (e) {}
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
