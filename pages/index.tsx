import type { GetStaticProps, InferGetStaticPropsType } from "next";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Import layout and components
import DefaultLayout from "@/layouts/default";
import LandingPage from "@/components/landing/landing-page";
import Network from "./table";

/**
 * Props for the IndexPage component
 */
interface IndexPageProps {
  staticData?: {
    lastUpdated: string;
    version: string;
  };
}

/**
 * Main index page component with authentication routing
 * Shows landing page for unauthenticated users, contacts for authenticated users
 */
export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
): JSX.Element {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication status
  useEffect(() => {
    // TODO: Replace with actual authentication check
    // For now, we'll check for a simple localStorage token or session
    const checkAuth = () => {
      try {
        // Check for authentication token/session
        const token = localStorage.getItem("auth_token");
        const userSession = localStorage.getItem("user_session");

        // If user has valid authentication, redirect to contacts
        if (token || userSession) {
          setIsAuthenticated(true);
          router.replace("/contacts");
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        // In case localStorage is not available (SSR), default to unauthenticated
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DefaultLayout>
    );
  }

  // Show contacts page for authenticated users
  if (isAuthenticated) {
    return (
      <DefaultLayout>
        <Network />
      </DefaultLayout>
    );
  }

  // Show landing page for unauthenticated users
  return <LandingPage />;
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
