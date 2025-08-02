import NextHead from "next/head";

import { siteConfig } from "@/config/site";

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const Head = ({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  url = siteConfig.url,
  type = "website",
}: HeadProps) => {
  const fullTitle =
    title === siteConfig.name ? title : `${title} | ${siteConfig.company}`;

  return (
    <NextHead>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta content={description} name="description" />
      <meta content={siteConfig.keywords} name="keywords" />
      <meta content={siteConfig.company} name="author" />
      <meta content="index, follow" name="robots" />
      <meta content="en" name="language" />

      {/* Viewport and Device */}
      <meta
        content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
        name="viewport"
      />
      <meta content="#006FEE" name="theme-color" />
      <meta content="#006FEE" name="msapplication-TileColor" />

      {/* Open Graph / Facebook */}
      <meta content={type} property="og:type" />
      <meta content={url} property="og:url" />
      <meta content={fullTitle} property="og:title" />
      <meta content={description} property="og:description" />
      <meta content={image} property="og:image" />
      <meta content="1200" property="og:image:width" />
      <meta content="630" property="og:image:height" />
      <meta content={siteConfig.company} property="og:site_name" />
      <meta content="en_US" property="og:locale" />

      {/* Twitter Card */}
      <meta content="summary_large_image" name="twitter:card" />
      <meta content={url} name="twitter:url" />
      <meta content={fullTitle} name="twitter:title" />
      <meta content={description} name="twitter:description" />
      <meta content={image} name="twitter:image" />

      {/* Canonical URL */}
      <link href={url} rel="canonical" />

      {/* Favicons */}
      <link href="/favicon.ico" rel="icon" type="image/x-icon" />
      <link
        href="/favicon-16x16.png"
        rel="icon"
        sizes="16x16"
        type="image/png"
      />
      <link
        href="/favicon-32x32.png"
        rel="icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href="/apple-touch-icon.png"
        rel="apple-touch-icon"
        sizes="180x180"
      />

      {/* Preconnect for Performance */}
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link
        crossOrigin="anonymous"
        href="https://fonts.gstatic.com"
        rel="preconnect"
      />

      {/* JSON-LD Structured Data */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: siteConfig.company,
            description: description,
            url: siteConfig.url,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "99",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
            author: {
              "@type": "Organization",
              name: siteConfig.company,
              url: siteConfig.url,
            },
            screenshot: image,
            featureList: [
              "OCR Document Scanning",
              "Contact Management",
              "AI Data Enrichment",
              "Business Card Processing",
              "Workflow Automation",
            ],
          }),
        }}
        type="application/ld+json"
      />
    </NextHead>
  );
};
