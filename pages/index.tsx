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
  console.log("IndexPage rendering...");
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
        // If localStorage is not available (SSR), assume not authenticated
        console.log("Auth check error:", error);
      }
    };

    checkAuth();
  }, [router]);

  // Landing page for unauthenticated users
  console.log("Rendering landing page, isAuthenticated:", isAuthenticated);
  return (
    <LandingLayout>
      <div className="bg-[#FDF7F4] min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
            <div className="text-center">
              {/* Badge */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8"
              >
                <Icon
                  icon="solar:star-bold"
                  className="text-blue-600"
                  width={16}
                />
                <span className="text-blue-600 text-sm font-medium">
                  Best Contact Management Platform
                </span>
              </m.div>

              {/* Main Heading */}
              <m.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Let's Make Your Company <br />
                Management <span className="inline-block">🔥</span> Easier
              </m.h1>

              {/* Description */}
              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
              >
                Transform your business operations with our intelligent contact
                management system. Streamline workflows, improve efficiency, and
                focus on what truly matters.
              </m.p>

              {/* Buttons */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              >
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 h-12 rounded-full shadow-lg hover:shadow-xl transition-all"
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
                  className="text-gray-700 font-semibold px-8 py-3 h-12 rounded-full"
                  startContent={
                    <Icon
                      icon="solar:play-bold"
                      className="text-orange-500"
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
              </m.div>

              {/* Feature Icons */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex justify-center gap-8 md:gap-16 mb-16"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Icon
                      icon="solar:user-bold"
                      className="text-blue-600"
                      width={24}
                    />
                  </div>
                  <span className="text-sm text-gray-600">Personal</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Icon
                      icon="solar:users-group-two-rounded-bold"
                      className="text-green-600"
                      width={24}
                    />
                  </div>
                  <span className="text-sm text-gray-600">Employee</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Icon
                      icon="solar:chart-bold"
                      className="text-purple-600"
                      width={24}
                    />
                  </div>
                  <span className="text-sm text-gray-600">Mining</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Icon
                      icon="solar:calendar-bold"
                      className="text-pink-600"
                      width={24}
                    />
                  </div>
                  <span className="text-sm text-gray-600">Schedule</span>
                </div>
              </m.div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <m.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="relative max-w-6xl mx-auto px-6"
          >
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F14c1ca08871e4f80a1054797b1e2a6eb%2F6d2b85599d164d2f869d61202dfe3b26?format=webp&width=800"
                  alt="Company Management Dashboard"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </m.div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Effortlessly manage and optimize{" "}
                  <span className="text-gray-500">your company operations</span>{" "}
                  with our all-in-one platform.{" "}
                  <span className="text-gray-500">
                    Simplify workflows, improve efficiency, and focus on what
                    truly matters.
                  </span>
                </h2>
              </div>
              <div className="grid gap-6">
                <Card className="p-6 border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardBody className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon
                          icon="solar:widget-bold"
                          className="text-blue-600"
                          width={24}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                          Ease Of Works
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Streamline your business processes with intuitive
                          tools and automated workflows
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className="p-6 border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardBody className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon
                          icon="solar:layers-bold"
                          className="text-green-600"
                          width={24}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                          All In One Solution
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Complete business management solution with integrated
                          contact and document systems
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
                        <p className="text-gray-600 text-sm">
                          Tailor the platform to match your unique business
                          requirements and workflows
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
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Solution Multiple <span className="text-blue-600">📊</span>{" "}
              Aspects
            </h2>
            <p className="text-gray-600 mb-16">
              We believe various aspects always give best platform for your
              convenience
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="p-8 border-0 bg-gradient-to-br from-blue-50 to-white shadow-lg">
                <CardBody className="p-0 text-center">
                  <div className="mb-6">
                    <div className="inline-block p-4 bg-blue-100 rounded-2xl">
                      <Icon
                        icon="solar:users-group-rounded-bold"
                        className="text-blue-600"
                        width={32}
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Organized Employee
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Manage your team effectively with our comprehensive employee
                    management tools and analytics
                  </p>
                </CardBody>
              </Card>

              <Card className="p-8 border-0 bg-gradient-to-br from-green-50 to-white shadow-lg">
                <CardBody className="p-0 text-center">
                  <div className="mb-6">
                    <div className="inline-block p-4 bg-green-100 rounded-2xl">
                      <Icon
                        icon="solar:dollar-bold"
                        className="text-green-600"
                        width={32}
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Financial Management
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Track expenses, manage budgets, and get financial insights
                    with advanced reporting tools
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        {/* Simplify Your Productivity */}
        <section className="py-20 bg-[#FDF7F4]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simplify Your <span className="text-blue-600">💻</span>{" "}
              Productivity
            </h2>
            <p className="text-gray-600 mb-16">
              With various platform integrations, it can make your work easier
            </p>

            <div className="flex justify-center flex-wrap gap-6 mb-12">
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

            <p className="text-gray-600 text-lg">
              Can be integrated with 10+ Platforms
            </p>
            <p className="text-gray-500 text-sm">
              Platform that can be integrated and support for the ease and
              functions
            </p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What They Say <span className="text-green-600">✅</span> About Us
            </h2>
            <p className="text-gray-600 mb-16">
              More of their best comments are already satisfied with our
              platform
            </p>

            <div className="max-w-4xl mx-auto">
              <Card className="p-8 border-0 bg-gradient-to-br from-gray-50 to-white shadow-lg">
                <CardBody className="p-0">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gray-300 rounded-2xl flex-shrink-0"></div>
                    <div className="text-left">
                      <p className="text-lg text-gray-700 mb-4 italic">
                        "This platform helps us to manage our team, finances,
                        hiring process, & daily tasks efficiently in one
                        platform. This seamless workflow really helps us
                        maintain our operations."
                      </p>
                      <div>
                        <p className="font-bold text-gray-900">
                          Alejandra Mevera
                        </p>
                        <p className="text-gray-600 text-sm">Head Team Ops</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-[#FDF7F4]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Ready to simplify your business operations today?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start using Convents Make and get access of many features for your
              business and scale up your operation
            </p>
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 h-12 rounded-full shadow-lg hover:shadow-xl transition-all"
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
