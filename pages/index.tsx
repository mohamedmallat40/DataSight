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
      <LandingLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold">Loading...</h1>
            <p className="text-default-500">Checking authentication...</p>
          </div>
        </div>
      </LandingLayout>
    );
  }

  // Landing page for unauthenticated users
  return (
    <LandingLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Icon icon="lucide:sparkles" width={16} />
              AI-Powered CMS Solution
            </span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            Smart Contact Management
            <br />
            <span className="text-5xl">with OCR & AI</span>
          </h1>
          <p className="text-xl text-default-600 mb-8 max-w-4xl mx-auto">
            Transform your business cards and documents into actionable data
            instantly. Our AI-driven CMS automatically extracts, processes, and
            organizes contact information with advanced OCR technology and
            intelligent data enrichment.
          </p>
          <div className="flex gap-4 justify-center mb-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              onPress={() => {
                const event = new CustomEvent("openRegister");
                window.dispatchEvent(event);
              }}
              startContent={<Icon icon="lucide:scan" width={20} />}
            >
              Start Scanning Now
            </Button>
            <Button
              size="lg"
              variant="bordered"
              className="font-semibold border-primary/20 text-primary hover:bg-primary/5"
              onPress={() => {
                const event = new CustomEvent("openLogin");
                window.dispatchEvent(event);
              }}
              startContent={<Icon icon="lucide:eye" width={20} />}
            >
              View Demo
            </Button>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm text-default-500">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:check" className="text-success" width={16} />
              <span>Instant OCR Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:check" className="text-success" width={16} />
              <span>AI Data Enrichment</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:check" className="text-success" width={16} />
              <span>Smart Organization</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <section id="features" className="scroll-mt-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Revolutionary Technology
              </span>
            </h2>
            <p className="text-lg text-default-600 max-w-3xl mx-auto">
              Experience the next generation of contact management with
              cutting-edge OCR technology and AI-powered automation that
              transforms how you handle business information.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="group hover:scale-105 transition-all duration-300 border-primary/10 hover:border-primary/30 hover:shadow-xl">
              <CardBody className="text-center p-8">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Icon
                    icon="lucide:scan-text"
                    className="w-10 h-10 text-primary"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Advanced OCR Engine
                </h3>
                <p className="text-default-600 leading-relaxed">
                  Instantly extract text from business cards, documents, and
                  images with 99.9% accuracy. Support for multiple languages and
                  handwritten text recognition.
                </p>
              </CardBody>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 border-secondary/10 hover:border-secondary/30 hover:shadow-xl">
              <CardBody className="text-center p-8">
                <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Icon
                    icon="lucide:brain-circuit"
                    className="w-10 h-10 text-secondary"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  AI Data Enrichment
                </h3>
                <p className="text-default-600 leading-relaxed">
                  Automatically enhance contact data with company information,
                  social profiles, and business insights using advanced machine
                  learning algorithms.
                </p>
              </CardBody>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 border-success/10 hover:border-success/30 hover:shadow-xl">
              <CardBody className="text-center p-8">
                <div className="bg-gradient-to-r from-success/10 to-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Icon
                    icon="lucide:workflow"
                    className="w-10 h-10 text-success"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Automation</h3>
                <p className="text-default-600 leading-relaxed">
                  Intelligent workflows that automatically categorize, tag, and
                  organize contacts. Reduce manual work by 90% with AI-powered
                  data processing.
                </p>
              </CardBody>
            </Card>
          </div>

          {/* Additional Features Row */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-primary/5 to-transparent">
              <CardBody className="p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-lg p-3 group-hover:bg-primary/20 transition-colors">
                    <Icon
                      icon="lucide:database"
                      className="w-6 h-6 text-primary"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      Intelligent CMS
                    </h4>
                    <p className="text-default-600">
                      Advanced content management with smart search, filtering,
                      and organization. Find any contact or document in seconds
                      with AI-powered search.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-secondary/5 to-transparent">
              <CardBody className="p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary/10 rounded-lg p-3 group-hover:bg-secondary/20 transition-colors">
                    <Icon
                      icon="lucide:shield-check"
                      className="w-6 h-6 text-secondary"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      Enterprise Security
                    </h4>
                    <p className="text-default-600">
                      Bank-level encryption and security protocols. GDPR
                      compliant with advanced privacy controls and audit trails.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="scroll-mt-16 mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Next-Gen Technology
                </span>
              </h2>
              <p className="text-lg text-default-600 mb-6">
                Built with cutting-edge OCR and AI technology, our CMS solution
                transforms how businesses handle contact data. From business
                cards to complex documents, extract and organize information
                with unprecedented accuracy and speed.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-xl">
                  <p className="text-3xl font-bold text-primary">99.9%</p>
                  <p className="text-sm text-default-500">OCR Accuracy</p>
                </div>
                <div className="text-center p-4 bg-secondary/5 rounded-xl">
                  <p className="text-3xl font-bold text-secondary">90%</p>
                  <p className="text-sm text-default-500">Time Reduction</p>
                </div>
                <div className="text-center p-4 bg-success/5 rounded-xl">
                  <p className="text-3xl font-bold text-success">50+</p>
                  <p className="text-sm text-default-500">Languages</p>
                </div>
                <div className="text-center p-4 bg-warning/5 rounded-xl">
                  <p className="text-3xl font-bold text-warning">24/7</p>
                  <p className="text-sm text-default-500">AI Processing</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center border border-primary/10">
              <Icon
                icon="lucide:scan-line"
                className="w-20 h-20 text-primary mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                Instant Data Extraction
              </h3>
              <p className="text-default-600 mb-4">
                Upload any business card or document and watch our AI instantly
                extract, categorize, and enrich the data with additional
                business intelligence.
              </p>
              <div className="flex justify-center">
                <Button
                  size="sm"
                  variant="bordered"
                  className="border-primary/20 text-primary hover:bg-primary/10"
                  startContent={<Icon icon="lucide:play" width={16} />}
                >
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 overflow-hidden">
          <CardBody className="text-center p-12 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
            <div className="mb-6">
              <Icon
                icon="lucide:zap"
                className="w-16 h-16 text-primary mx-auto mb-4"
              />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-default-600 mb-8 max-w-3xl mx-auto">
              Experience the power of AI-driven contact management. Upload your
              first business card and see the magic happen in seconds. No credit
              card required for your free trial.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                onPress={() => {
                  const event = new CustomEvent("openRegister");
                  window.dispatchEvent(event);
                }}
                startContent={<Icon icon="lucide:rocket" width={20} />}
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="bordered"
                className="border-primary/20 text-primary hover:bg-primary/5 font-semibold"
                startContent={<Icon icon="lucide:phone" width={20} />}
              >
                Schedule Demo
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-default-500">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:check" className="text-success" width={16} />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:check" className="text-success" width={16} />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:check" className="text-success" width={16} />
                <span>Cancel anytime</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </LandingLayout>
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
