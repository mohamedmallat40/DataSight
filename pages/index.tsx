import type { GetStaticProps, InferGetStaticPropsType } from "next";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";

import LandingLayout from "@/layouts/landing";

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
 * Main index page component
 */
export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
): JSX.Element {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      const isAuth = !!token;
      setIsAuthenticated(isAuth);

      if (isAuth) {
        router.replace("/contacts");
      }
    };

    checkAuth();
  }, [router]);

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold">Loading...</h1>
            <p className="text-default-500">Checking authentication...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  // Landing page for unauthenticated users
  return (
    <DefaultLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            All Care Medical Group
          </h1>
          <p className="text-xl text-default-600 mb-8 max-w-3xl mx-auto">
            Advanced Healthcare Management Platform powered by AI. Streamline
            your medical practice with intelligent contact management, automated
            workflows, and comprehensive patient care solutions.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              color="primary"
              className="font-semibold"
              onPress={() => {
                const event = new CustomEvent("openRegister");
                window.dispatchEvent(event);
              }}
              startContent={<Icon icon="lucide:user-plus" width={20} />}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="bordered"
              className="font-semibold"
              onPress={() => {
                const event = new CustomEvent("openLogin");
                window.dispatchEvent(event);
              }}
              startContent={<Icon icon="lucide:log-in" width={20} />}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:scale-105 transition-transform duration-200">
            <CardBody className="text-center p-8">
              <Icon
                icon="lucide:users"
                className="w-12 h-12 text-primary mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Contact Management</h3>
              <p className="text-default-600">
                Organize and manage patient contacts with advanced filtering,
                search, and bulk operations.
              </p>
            </CardBody>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-200">
            <CardBody className="text-center p-8">
              <Icon
                icon="lucide:brain"
                className="w-12 h-12 text-secondary mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-default-600">
                Leverage artificial intelligence for predictive analytics and
                automated healthcare workflows.
              </p>
            </CardBody>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-200">
            <CardBody className="text-center p-8">
              <Icon
                icon="lucide:activity"
                className="w-12 h-12 text-success mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                Real-time Analytics
              </h3>
              <p className="text-default-600">
                Monitor key metrics and performance indicators with
                comprehensive dashboard views.
              </p>
            </CardBody>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardBody className="text-center p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-lg text-default-600 mb-6 max-w-2xl mx-auto">
              Join thousands of healthcare professionals who trust All Care
              Medical Group for their practice management needs.
            </p>
            <Button
              size="lg"
              color="primary"
              className="font-semibold"
              onPress={() => {
                const event = new CustomEvent("openRegister");
                window.dispatchEvent(event);
              }}
              endContent={<Icon icon="lucide:arrow-right" width={20} />}
            >
              Start Your Free Trial
            </Button>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
}

/**
 * Static props generation for the index page
 */
export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {
  try {
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

export type { IndexPageProps };
