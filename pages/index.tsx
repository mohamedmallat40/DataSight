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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("auth_token");
        const isAuth = !!token;
        setIsAuthenticated(isAuth);

        if (isAuth) {
          router.replace("/contacts");
          return;
        }
      } catch (error) {
        console.log("Auth check error:", error);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <LandingLayout>
      {/* Hero Section with exact pink background */}
      <div style={{ backgroundColor: "#FDF0ED" }} className="min-h-screen">
        <section className="relative overflow-hidden pt-12 pb-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              {/* Blue badge */}
              <div className="inline-flex items-center gap-2 mb-8">
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
                  <Icon
                    icon="solar:star-bold"
                    className="text-blue-600"
                    width={16}
                  />
                  <span className="text-blue-600 text-sm font-medium">
                    Best Contact Management Platform
                  </span>
                </div>
              </div>

              {/* Main heading - exact typography */}
              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                Let's Make Your Company <br />
                Management{" "}
                <span className="inline-block text-6xl lg:text-7xl">
                  🔥
                </span>{" "}
                Easier
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Transform your business operations with our intelligent contact
                management system. Streamline workflows, improve efficiency, and
                focus on what truly matters.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-3 h-12 rounded-full min-w-[140px]"
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
                  className="text-gray-700 font-medium px-6 py-3 h-12 rounded-full"
                  startContent={
                    <Icon
                      icon="solar:play-bold"
                      className="text-gray-700"
                      width={20}
                    />
                  }
                  onPress={() => {
                    const event = new CustomEvent("openLogin");
                    window.dispatchEvent(event);
                  }}
                >
                  Play Video
                </Button>
              </div>

              {/* Feature icons row */}
              <div className="flex justify-center gap-12 lg:gap-20 mb-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Icon
                      icon="solar:user-bold"
                      className="text-blue-600"
                      width={28}
                    />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    Personal
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                    <Icon
                      icon="solar:users-group-two-rounded-bold"
                      className="text-green-600"
                      width={28}
                    />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    Employee
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <Icon
                      icon="solar:chart-bold"
                      className="text-purple-600"
                      width={28}
                    />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    Mining
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center">
                    <Icon
                      icon="solar:calendar-bold"
                      className="text-pink-600"
                      width={28}
                    />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    Schedule
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="relative max-w-5xl mx-auto px-6">
            <div className="relative">
              {/* Subtle background blur */}
              <div className="absolute -inset-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl blur-3xl" />

              {/* Dashboard container */}
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F14c1ca08871e4f80a1054797b1e2a6eb%2F6d2b85599d164d2f869d61202dfe3b26?format=webp&width=800"
                  alt="Company Management Dashboard"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content section with text and cards */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Left side - Large text */}
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-8">
                  <span className="text-gray-900">
                    Effortlessly manage and optimize{" "}
                  </span>
                  <span className="text-gray-400">your company operations</span>
                  <span className="text-gray-900">
                    {" "}
                    with our all-in-one platform.{" "}
                  </span>
                  <span className="text-gray-400">
                    Simplify workflows, improve efficiency, and focus on what
                    truly matters
                  </span>
                </h2>
              </div>

              {/* Right side - Feature cards */}
              <div className="space-y-6">
                <Card className="p-6 border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardBody className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon
                          icon="solar:check-circle-bold"
                          className="text-green-600"
                          width={24}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                          Ease Of Works
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Seamlessly collaborate across teams with streamlined
                          communication and project organization
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className="p-6 border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardBody className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon
                          icon="solar:layers-bold"
                          className="text-blue-600"
                          width={24}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                          All In One Solution
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Manage everything from one place with comprehensive
                          business tools and analytics
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className="p-6 border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardBody className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon
                          icon="solar:settings-bold"
                          className="text-purple-600"
                          width={24}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                          Customization
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Tailor workflows to match your unique business
                          requirements and processes
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Multiple Aspects */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Solution Multiple <span className="text-blue-600">📊</span>{" "}
              Aspects
            </h2>
            <p className="text-gray-600 mb-16 text-lg">
              We believe various aspects always give best platform for your
              convenience
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Employee card */}
              <Card className="p-8 border-0 bg-gradient-to-br from-blue-50 to-white shadow-lg">
                <CardBody className="p-0 text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon
                        icon="solar:users-group-rounded-bold"
                        className="text-blue-600"
                        width={36}
                      />
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                      <div className="text-xs text-gray-500 mb-1">
                        Employee Overview
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        178 Employee
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <div className="w-16 h-2 bg-blue-500 rounded"></div>
                        <span className="text-xs text-gray-500">85%</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Organized Employee
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Manage your workforce efficiently with advanced employee
                    tracking and performance metrics
                  </p>
                </CardBody>
              </Card>

              {/* Financial card */}
              <Card className="p-8 border-0 bg-gradient-to-br from-green-50 to-white shadow-lg">
                <CardBody className="p-0 text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon
                        icon="solar:dollar-bold"
                        className="text-green-600"
                        width={36}
                      />
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                      <div className="text-xs text-gray-500 mb-1">Revenue</div>
                      <div className="text-lg font-bold text-gray-900">
                        $24,239.00
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <Icon
                          icon="solar:arrow-up-bold"
                          className="text-green-500"
                          width={12}
                        />
                        <span className="text-xs text-green-500">+12%</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Financial Management
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Track revenue, expenses, and financial metrics with
                    comprehensive reporting tools
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        {/* Simplify Your Productivity */}
        <section style={{ backgroundColor: "#FDF0ED" }} className="py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simplify Your <span className="text-blue-600">💻</span>{" "}
              Productivity
            </h2>
            <p className="text-gray-600 mb-16 text-lg">
              With various platform integrations, it can make your work easier
            </p>

            {/* Integration icons */}
            <div className="flex justify-center flex-wrap gap-4 mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Icon icon="logos:slack-icon" width={32} />
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Icon icon="logos:microsoft-teams" width={32} />
              </div>
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                <Icon icon="logos:google-gmail" width={32} />
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Icon icon="logos:dropbox" width={32} />
              </div>
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Icon
                  icon="solar:figma-bold"
                  className="text-orange-500"
                  width={32}
                />
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <Icon icon="logos:whatsapp-icon" width={32} />
              </div>
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Icon icon="logos:notion-icon" width={32} />
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Icon icon="logos:zoom-icon" width={32} />
              </div>
            </div>

            <p className="text-gray-700 text-lg font-medium mb-2">
              Can be integrated with 10+ Platforms
            </p>
            <p className="text-gray-500">
              Platform that can be integrated and support for the ease and
              functions
            </p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What They Say <span className="text-green-600">✅</span> About Us
            </h2>
            <p className="text-gray-600 mb-16 text-lg">
              More of their best comments are already satisfied with our
              platform
            </p>

            <div className="max-w-4xl mx-auto">
              <Card className="p-8 border-0 bg-gradient-to-br from-gray-50 to-white shadow-lg">
                <CardBody className="p-0">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-2xl flex-shrink-0 overflow-hidden">
                      {/* Placeholder for customer image */}
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-lg text-gray-700 mb-6 italic leading-relaxed">
                        "This amazing platform helps us to manage our team,
                        finances, hiring process, & daily tasks efficiently in
                        one platform. This seamless workflow really helps us
                        maintain our operations."
                      </p>
                      <div className="border-l-4 border-orange-500 pl-4">
                        <p className="font-bold text-gray-900 text-lg">
                          Alejandra Mevera
                        </p>
                        <p className="text-gray-600">Head Team Ops</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ backgroundColor: "#FDF0ED" }} className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Ready to simplify your business operations today?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Start using Convents Make and get access of many features for your
              business and scale up your operation
            </p>
            <Button
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-3 h-12 rounded-full shadow-lg hover:shadow-xl transition-all"
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
