import type { GetStaticProps, InferGetStaticPropsType } from "next";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";

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
      <div className="relative flex min-h-[100vh] w-full flex-col overflow-hidden bg-gradient-to-br from-background via-background to-primary/[0.02]">
        <main className="container mx-auto mt-[60px] flex max-w-[1100px] flex-col items-start px-8">
          <section className="z-20 flex flex-col items-start justify-center gap-[24px] sm:gap-8 pb-[420px]">
            <m.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Button
                className="h-10 overflow-hidden border-1 border-primary/20 bg-primary/5 px-[20px] py-2 text-small font-medium leading-5 text-primary backdrop-blur-sm"
                endContent={
                  <Icon
                    className="flex-none outline-none [&>path]:stroke-[2] text-primary/70"
                    icon="solar:arrow-right-linear"
                    width={18}
                  />
                }
                radius="full"
                variant="bordered"
              >
                ✨ AI-Powered CMS Solution
              </Button>
            </m.div>
            <LazyMotion features={domAnimation}>
              <m.div
                animate="kick"
                className="flex flex-col gap-6"
                exit="auto"
                initial="auto"
                transition={{
                  duration: 0.25,
                  ease: "easeInOut",
                }}
                variants={{
                  auto: { width: "auto" },
                  kick: { width: "auto" },
                }}
              >
                <AnimatePresence mode="wait">
                  <m.div
                    key="hero-section-title"
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    className="text-start text-[clamp(42px,10vw,48px)] font-bold leading-[1.15] tracking-tight sm:text-[72px] sm:leading-[1.1]"
                    initial={{ filter: "blur(12px)", opacity: 0, y: 30 }}
                    transition={{
                      bounce: 0,
                      delay: 0.2,
                      duration: 0.8,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <div className="bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                      Smart Contact <br />
                      <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent font-extrabold">
                        Management
                      </span>{" "}
                      <br />
                      <span className="text-[0.85em] font-medium text-foreground/60">
                        with OCR & AI
                      </span>
                    </div>
                  </m.div>

                  <m.div
                    key="hero-section-description"
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    className="text-start font-normal leading-[1.7] text-default-500 sm:w-[520px] sm:text-[19px] text-[17px]"
                    initial={{ filter: "blur(8px)", opacity: 0, y: 20 }}
                    transition={{
                      bounce: 0,
                      delay: 0.4,
                      duration: 0.7,
                      type: "spring",
                      stiffness: 80,
                    }}
                  >
                    Transform your business cards and documents into actionable
                    data instantly. Our AI-driven CMS automatically extracts,
                    processes, and organizes contact information with{" "}
                    <span className="text-primary font-medium">
                      advanced OCR technology
                    </span>
                    .
                  </m.div>

                  <m.div
                    key="hero-section-buttons"
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
                    initial={{ filter: "blur(8px)", opacity: 0, y: 20 }}
                    transition={{
                      bounce: 0,
                      delay: 0.6,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 90,
                    }}
                  >
                    <Button
                      className="h-12 w-[180px] bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-[20px] py-[12px] text-small font-semibold leading-5 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      radius="full"
                      onPress={() => {
                        const event = new CustomEvent("openRegister");
                        window.dispatchEvent(event);
                      }}
                      startContent={
                        <Icon
                          className="text-white/90"
                          icon="solar:scanner-bold"
                          width={18}
                        />
                      }
                    >
                      Start Scanning
                    </Button>
                    <Button
                      className="h-12 w-[180px] border-1 border-default-200 hover:border-primary/30 bg-background/60 backdrop-blur-sm hover:bg-primary/5 px-[20px] py-[12px] text-small font-semibold leading-5 transition-all duration-300"
                      endContent={
                        <span className="pointer-events-none flex h-[24px] w-[24px] items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Icon
                            className="text-primary [&>path]:stroke-[1.5]"
                            icon="solar:arrow-right-linear"
                            width={14}
                          />
                        </span>
                      }
                      radius="full"
                      variant="bordered"
                      onPress={() => {
                        const event = new CustomEvent("openLogin");
                        window.dispatchEvent(event);
                      }}
                    >
                      View Demo
                    </Button>
                  </m.div>

                  <m.div
                    key="hero-section-features"
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    className="flex flex-wrap items-center gap-6 text-sm"
                    initial={{ filter: "blur(6px)", opacity: 0, y: 15 }}
                    transition={{
                      bounce: 0,
                      delay: 0.8,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-success/10 border border-success/20">
                      <Icon
                        icon="solar:check-circle-bold"
                        className="text-success"
                        width={16}
                      />
                      <span className="text-success/80 font-medium">
                        Instant OCR
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 border border-primary/20">
                      <Icon
                        icon="solar:check-circle-bold"
                        className="text-primary"
                        width={16}
                      />
                      <span className="text-primary/80 font-medium">
                        AI Enrichment
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary/10 border border-secondary/20">
                      <Icon
                        icon="solar:check-circle-bold"
                        className="text-secondary"
                        width={16}
                      />
                      <span className="text-secondary/80 font-medium">
                        Smart Organization
                      </span>
                    </div>
                  </m.div>
                </AnimatePresence>
              </m.div>
            </LazyMotion>
          </section>
        </main>

        <LazyMotion features={domAnimation}>
          <AnimatePresence mode="wait">
            <m.div
              key="hero-section-app-screenshot"
              animate={{ filter: "blur(0px)", opacity: 1, y: 0, scale: 1 }}
              className="absolute top-[340px] left-1/2 transform -translate-x-1/2 w-[92%] max-w-[950px] z-10"
              initial={{ filter: "blur(12px)", opacity: 0, y: 80, scale: 0.95 }}
              transition={{
                bounce: 0,
                delay: 1.0,
                duration: 0.8,
                type: "spring",
                stiffness: 80,
              }}
            >
              <div className="relative group">
                <div className="absolute -inset-6 bg-gradient-to-br from-primary/15 via-secondary/8 to-primary/10 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="relative bg-background/95 backdrop-blur-sm rounded-2xl border border-default-100 shadow-2xl hover:shadow-3xl overflow-hidden transition-all duration-500 group-hover:border-primary/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F14c1ca08871e4f80a1054797b1e2a6eb%2F3de12bbdf4ae42888e89ee06b42be323?format=webp&width=800"
                    alt="SmartCMS Contact Management Dashboard"
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </m.div>
          </AnimatePresence>
        </LazyMotion>

        <div className="pointer-events-none absolute inset-0 top-[-30%] z-0 scale-150 select-none sm:scale-125">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3" />
          <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
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
