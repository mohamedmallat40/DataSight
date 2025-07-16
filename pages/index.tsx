import type { GetStaticProps, InferGetStaticPropsType } from "next";

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";

import LandingLayout from "@/layouts/landing";
import PricingSection from "@/components/pricing/pricing-section";
import { useAuth } from "@/contexts/auth-context";

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
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect authenticated users to contacts page
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/contacts");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
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

  return (
    <LandingLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-background via-background to-primary/[0.02] min-h-screen">
        <section className="relative overflow-hidden pt-16 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              {/* Feature Badge */}
              <div className="inline-flex items-center justify-center mb-8">
                <Chip
                  startContent={<Icon icon="solar:star-linear" width={16} />}
                  variant="flat"
                  color="primary"
                  className="bg-primary/10 text-primary"
                >
                  Best Contact Management Platform
                </Chip>
              </div>

              {/* Main Heading */}
              <h1 className="text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
                Let's Make Your Company <br />
                Management{" "}
                <span className="inline-block text-6xl lg:text-7xl">
                  🔥
                </span>{" "}
                Easier
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-default-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                Transform your business operations with our intelligent contact
                management system. Streamline workflows, improve efficiency, and
                focus on what truly matters.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Button
                  size="lg"
                  color="primary"
                  radius="full"
                  className="min-w-[160px]"
                  onPress={() => {
                    const event = new CustomEvent("openRegister");
                    window.dispatchEvent(event);
                  }}
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="light"
                  radius="full"
                  startContent={<Icon icon="solar:play-linear" width={20} />}
                  className="min-w-[140px]"
                  onPress={() => {
                    const event = new CustomEvent("openLogin");
                    window.dispatchEvent(event);
                  }}
                >
                  Play Video
                </Button>
              </div>

              {/* Feature Categories */}
              <div className="flex justify-center gap-8 lg:gap-16 mb-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Icon
                      icon="solar:user-linear"
                      className="text-primary"
                      width={28}
                    />
                  </div>
                  <span className="text-sm text-default-500 font-medium">
                    Personal
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center">
                    <Icon
                      icon="solar:users-group-two-rounded-linear"
                      className="text-success"
                      width={28}
                    />
                  </div>
                  <span className="text-sm text-default-500 font-medium">
                    Employee
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center">
                    <Icon
                      icon="solar:chart-linear"
                      className="text-secondary"
                      width={28}
                    />
                  </div>
                  <span className="text-sm text-default-500 font-medium">
                    Mining
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-warning/10 rounded-2xl flex items-center justify-center">
                    <Icon
                      icon="solar:calendar-linear"
                      className="text-warning"
                      width={28}
                    />
                  </div>
                  <span className="text-sm text-default-500 font-medium">
                    Schedule
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto px-6">
            <Card className="bg-content1 shadow-2xl">
              <CardBody className="p-0">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F14c1ca08871e4f80a1054797b1e2a6eb%2Fb54cdc1d8bcd40b4856c5f81f77ed242?format=webp&width=800"
                  alt="PERLA CI Code Innovation Solutions Dashboard - showing contact list with business card data, employee management, and workflow automation features"
                  className="w-full h-auto rounded-lg"
                  loading="lazy"
                  width="800"
                  height="600"
                  itemProp="screenshot"
                />
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="py-20 bg-content1"
          aria-labelledby="features-heading"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Left Side - Main Text */}
              <div>
                <h2
                  id="features-heading"
                  className="text-4xl lg:text-5xl font-bold leading-tight mb-8"
                >
                  <span className="text-foreground">
                    Effortlessly manage and optimize{" "}
                  </span>
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    your company operations
                  </span>
                  <span className="text-foreground">
                    {" "}
                    with our all-in-one platform.{" "}
                  </span>
                  <span className="text-default-500">
                    Simplify workflows, improve efficiency, and focus on what
                    truly matters
                  </span>
                </h2>
              </div>

              {/* Right Side - Feature Cards */}
              <div className="space-y-6">
                <Card>
                  <CardBody className="flex flex-row items-start gap-4 p-6">
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon
                        icon="solar:check-circle-linear"
                        className="text-success"
                        width={24}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Ease Of Works
                      </h3>
                      <p className="text-default-500 text-sm leading-relaxed">
                        Seamlessly collaborate across teams with streamlined
                        communication and project organization
                      </p>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="flex flex-row items-start gap-4 p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon
                        icon="solar:layers-linear"
                        className="text-primary"
                        width={24}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        All In One Solution
                      </h3>
                      <p className="text-default-500 text-sm leading-relaxed">
                        Manage everything from one place with comprehensive
                        business tools and analytics
                      </p>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="flex flex-row items-start gap-4 p-6">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon
                        icon="solar:settings-linear"
                        className="text-secondary"
                        width={24}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Customization
                      </h3>
                      <p className="text-default-500 text-sm leading-relaxed">
                        Tailor workflows to match your unique business
                        requirements and processes
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Aspects Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Solution Multiple <span className="text-primary">📊</span>{" "}
                Aspects
              </h2>
              <p className="text-default-500 text-lg max-w-2xl mx-auto">
                We believe various aspects always give best platform for your
                convenience
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Employee Management Card */}
              <Card className="bg-gradient-to-br from-primary/5 to-transparent">
                <CardBody className="text-center p-8">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon
                        icon="solar:users-group-rounded-linear"
                        className="text-primary"
                        width={36}
                      />
                    </div>
                    <Card className="bg-background shadow-sm">
                      <CardBody className="p-4">
                        <div className="text-xs text-default-400 mb-1">
                          Employee Overview
                        </div>
                        <div className="text-lg font-bold text-foreground">
                          178 Employee
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <div className="w-16 h-2 bg-primary rounded-full"></div>
                          <span className="text-xs text-default-400">85%</span>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Organized Employee
                  </h3>
                  <p className="text-default-500 text-sm">
                    Manage your workforce efficiently with advanced employee
                    tracking and performance metrics
                  </p>
                </CardBody>
              </Card>

              {/* Financial Management Card */}
              <Card className="bg-gradient-to-br from-success/5 to-transparent">
                <CardBody className="text-center p-8">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon
                        icon="solar:dollar-linear"
                        className="text-success"
                        width={36}
                      />
                    </div>
                    <Card className="bg-background shadow-sm">
                      <CardBody className="p-4">
                        <div className="text-xs text-default-400 mb-1">
                          Revenue
                        </div>
                        <div className="text-lg font-bold text-foreground">
                          $24,239.00
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <Icon
                            icon="solar:arrow-up-linear"
                            className="text-success"
                            width={12}
                          />
                          <span className="text-xs text-success">+12%</span>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Financial Management
                  </h3>
                  <p className="text-default-500 text-sm">
                    Track revenue, expenses, and financial metrics with
                    comprehensive reporting tools
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="py-20 bg-content1">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Simplify Your <span className="text-primary">💻</span>{" "}
                Productivity
              </h2>
              <p className="text-default-500 text-lg">
                With various platform integrations, it can make your work easier
              </p>
            </div>

            {/* Integration Icons */}
            <div className="flex justify-center flex-wrap gap-4 mb-8">
              {[
                { icon: "logos:slack-icon", bg: "bg-primary/10" },
                { icon: "logos:microsoft-teams", bg: "bg-secondary/10" },
                { icon: "logos:google-gmail", bg: "bg-danger/10" },
                { icon: "logos:dropbox", bg: "bg-primary/10" },
                {
                  icon: "solar:figma-linear",
                  bg: "bg-warning/10",
                  color: "text-warning",
                },
                { icon: "logos:whatsapp-icon", bg: "bg-success/10" },
                { icon: "logos:notion-icon", bg: "bg-default/10" },
                { icon: "logos:zoom-icon", bg: "bg-primary/10" },
              ].map((integration, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 ${integration.bg} rounded-2xl flex items-center justify-center`}
                >
                  <Icon
                    icon={integration.icon}
                    width={32}
                    className={integration.color || ""}
                  />
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-foreground text-lg font-medium mb-2">
                Can be integrated with 10+ Platforms
              </p>
              <p className="text-default-400">
                Platform that can be integrated and support for the ease and
                functions
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <PricingSection />
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                What They Say <span className="text-success">✅</span> About Us
              </h2>
              <p className="text-default-500 text-lg">
                More of their best comments are already satisfied with our
                platform
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-br from-content2 to-content1">
                <CardBody className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-default-200 to-default-300 rounded-2xl flex-shrink-0"></div>
                    <div className="text-left flex-1">
                      <blockquote className="text-lg text-foreground mb-6 italic leading-relaxed">
                        "This amazing platform helps us to manage our team,
                        finances, hiring process, & daily tasks efficiently in
                        one platform. This seamless workflow really helps us
                        maintain our operations."
                      </blockquote>
                      <div className="border-l-4 border-primary pl-4">
                        <p className="font-semibold text-foreground text-lg">
                          Alejandra Mevera
                        </p>
                        <p className="text-default-500">Head Team Ops</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-content1">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Ready to simplify your business operations today?
            </h2>
            <p className="text-xl text-default-500 mb-8 leading-relaxed">
              Start using Convents and get access to many features for your
              business and scale up your operation
            </p>
            <Button
              size="lg"
              color="primary"
              radius="full"
              className="px-8"
              onPress={() => {
                const event = new CustomEvent("openRegister");
                window.dispatchEvent(event);
              }}
            >
              Get Started
            </Button>
          </div>
        </section>
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
