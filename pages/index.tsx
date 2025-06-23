import type { GetStaticProps, InferGetStaticPropsType } from "next";
import type { LogoItem, ThemeType } from "@/types";

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";

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

// Import layout and main components
import Network from "./table";

import DefaultLayout from "@/layouts/default";

// Import types

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
  const router = useRouter();
  const { theme } = useTheme();

  // Redirect to Statistics page by default
  useEffect(() => {
    router.replace("/statistics");
  }, [router]);

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
        aria-label={`${key} logo`}
        className="flex items-center justify-center text-foreground"
        role="img"
      >
        {logo}
      </div>
    ));
  }, [logos]);

  return (
    <DefaultLayout>
      <Network />
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
    };
  }
};

// Type exports for use in other components
export type { IndexPageProps };
