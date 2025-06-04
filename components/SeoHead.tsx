import Head from "next/head";

type SeoProps = {
  title: string;
  description: string;
  keywords: string;
  locale: "en" | "fr" | "ar" | "nl";
  canonical: string;
};

const localeMap: Record<string, string> = {
  en: "en_US",
  fr: "fr_FR",
  ar: "ar_TN",
  nl: "nl_BE",
};

export default function SeoHead({
  title,
  description,
  keywords,
  locale,
  canonical,
}: SeoProps) {
  const siteName = "Perla CI";
  const image = "https://www.perla-it.com/og-image.png";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={localeMap[locale]} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href="https://www.perla-it.com/en" />
      <link rel="alternate" hrefLang="fr" href="https://www.perla-it.com/fr" />
      <link rel="alternate" hrefLang="ar" href="https://www.perla-it.com/ar" />
      <link rel="alternate" hrefLang="nl" href="https://www.perla-it.com/nl" />
    </Head>
  );
}
