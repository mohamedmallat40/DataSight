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
      <meta content={description} name="description" />
      <meta content={keywords} name="keywords" />
      <meta content="index, follow" name="robots" />
      <meta content={title} property="og:title" />
      <meta content={description} property="og:description" />
      <meta content="website" property="og:type" />
      <meta content={siteName} property="og:site_name" />
      <meta content={canonical} property="og:url" />
      <meta content={image} property="og:image" />
      <meta content={localeMap[locale]} property="og:locale" />
      <meta content="summary_large_image" name="twitter:card" />
      <meta content={title} name="twitter:title" />
      <meta content={description} name="twitter:description" />
      <meta content={image} name="twitter:image" />
      <link href={canonical} rel="canonical" />
      <link href="https://www.perla-it.com/en" hrefLang="en" rel="alternate" />
      <link href="https://www.perla-it.com/fr" hrefLang="fr" rel="alternate" />
      <link href="https://www.perla-it.com/ar" hrefLang="ar" rel="alternate" />
      <link href="https://www.perla-it.com/nl" hrefLang="nl" rel="alternate" />
    </Head>
  );
}
