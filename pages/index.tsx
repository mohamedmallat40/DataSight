import React from "react";
import { useTheme } from "next-themes";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

// Import logo components with proper types
import {
  alwasaet,
  proxymLight,
  aramco,
  extraexpertise,
  proxymDark,
  zacta,
  dnextDark,
  dnextLight,
  tawazi,
  tawazi_dark,
} from "../components/logos";

// Import page components
import Footer from "./footer/footer";
import ScrollingBanner from "./brand-scrooling-banner/scrolling-banner";
import HeroLandingSection from "./hero/hero-section";
import Services from "./services/services";
import AdditionalDetails from "./additional-details/additional-details";
import UIUXSection from "./hero/ui-components-boost";
import TachnoSection from "./technologies/techno";

// Import layout and main components
import DefaultLayout from "@/layouts/default";
import Network from "./table";

// Import types
import type { LogoItem, ThemeType } from "@/types";

/**
 * Props for the IndexPage component
 */
interface IndexPageProps {
  // Add any static props here if needed in the future
  staticData?: {
    lastUpdated: string;
    version: string;
  };
}

/**
 * Configuration for logo display based on theme
 */
const createLogoConfig = (theme: ThemeType): readonly LogoItem[] => {
  return [
    {
      key: "alwasaet",
      logo: alwasaet,
    },
    {
      key: "proxym-it",
      logo: theme === "dark" ? proxymLight : proxymDark,
    },
    {
      key: "dnext",
      logo: theme === "dark" ? dnextLight : dnextDark,
    },
    {
      key: "aramco",
      logo: aramco,
    },
    {
      key: "extraexpertise",
      logo: extraexpertise,
    },
    {
      key: "zacta",
      logo: zacta,
    },
    {
      key: "tawazi",
      logo: theme === "dark" ? tawazi : tawazi_dark,
    },
  ] as const;
};

/**
 * Main index page component with enhanced TypeScript typing
 *
 * @param props - The component props
 * @returns JSX.Element representing the main page
 */
export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
): JSX.Element {
  const { theme } = useTheme();

  // Create logo configuration based on current theme
  const logos: readonly LogoItem[] = React.useMemo(
    () => createLogoConfig(theme as ThemeType),
    [theme],
  );

  // Render logo items with proper typing
  const renderLogos = React.useCallback(() => {
    return logos.map(({ key, logo }: LogoItem) => (
      <div
        key={key}
        className="flex items-center justify-center text-foreground"
        role="img"
        aria-label={`${key} logo`}
      >
        {logo}
      </div>
    ));
  }, [logos]);

  return (
    <DefaultLayout>
      {/* Main content - currently showing Network (table) component */}
      <Network />

      {/*
        Commented out sections - can be enabled as needed
        Each section is properly typed and ready for use
      */}
      {/*
      <HeroLandingSection />
      <Services />
      <ScrollingBanner shouldPauseOnHover gap="80px">
        {renderLogos()}
      </ScrollingBanner>
      <UIUXSection />
      <TachnoSection />
      <AdditionalDetails />
      <Footer />
      */}
    </DefaultLayout>
  );
}

/**
 * Static props generation for the index page
 * This ensures type safety for any static data needed
 */
export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {
  try {
    // Add any static data fetching logic here
    const staticData = {
      lastUpdated: new Date().toISOString(),
      version: "1.0.0",
    };

    return {
      props: {
        staticData,
      },
      // Revalidate every hour (3600 seconds)
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);

    return {
      props: {
        staticData: {
          lastUpdated: new Date().toISOString(),
          version: "1.0.0",
        },
      },
      revalidate: 3600,
    };
  }
};

// Type exports for use in other components
export type { IndexPageProps };
