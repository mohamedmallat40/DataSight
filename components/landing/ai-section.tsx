"use client";

import React from "react";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import Image from "next/image";

export default function AISection() {
  return (
    <section className="py-24 px-4 sm:px-8 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
      <div className="mx-auto max-w-7xl">
        <LazyMotion features={domAnimation}>
          {/* Section Header */}
          <m.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Chip
              className="mb-6"
              color="primary"
              variant="flat"
              startContent={
                <Icon icon="solar:stars-minimalistic-outline" width={16} />
              }
            >
              AI-Powered Intelligence
            </Chip>
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Advanced AI That{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Works For You
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-default-600">
              Our cutting-edge artificial intelligence doesn't just store
              data—it understands it, learns from it, and helps you make better
              decisions for your patients and practice.
            </p>
          </m.div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* AI Features List */}
            <m.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60">
                    <Icon
                      className="text-white"
                      icon="solar:cpu-outline"
                      width={24}
                    />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">
                      Intelligent Data Processing
                    </h3>
                    <p className="text-default-600">
                      Automatically extract and categorize patient information
                      from various sources, reducing manual data entry by up to
                      90%.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-success to-success/60">
                    <Icon
                      className="text-white"
                      icon="solar:chart-outline"
                      width={24}
                    />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">
                      Predictive Analytics
                    </h3>
                    <p className="text-default-600">
                      Identify patterns and trends in patient data to predict
                      health outcomes and optimize treatment plans.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-warning to-warning/60">
                    <Icon
                      className="text-white"
                      icon="solar:bell-outline"
                      width={24}
                    />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">
                      Smart Alerts & Reminders
                    </h3>
                    <p className="text-default-600">
                      AI-powered notifications for follow-ups, medication
                      reminders, and critical patient updates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-secondary/60">
                    <Icon
                      className="text-white"
                      icon="solar:language-outline"
                      width={24}
                    />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">
                      Natural Language Processing
                    </h3>
                    <p className="text-default-600">
                      Extract meaningful insights from unstructured medical
                      notes and convert them into actionable data.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                className="bg-gradient-to-r from-primary to-secondary text-white"
                radius="full"
                size="lg"
              >
                <Icon icon="solar:document-text-outline" width={20} />
                Learn More About Our AI
              </Button>
            </m.div>

            {/* AI Dashboard Preview */}
            <m.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-default-50 to-default-100 shadow-2xl">
                <CardBody className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src="https://images.pexels.com/photos/6153740/pexels-photo-6153740.jpeg"
                      alt="AI-powered healthcare technology interface"
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Floating AI Metrics */}
                    <div className="absolute top-4 right-4">
                      <Card className="bg-white/90 backdrop-blur-sm">
                        <CardBody className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium">
                              AI Active
                            </span>
                          </div>
                        </CardBody>
                      </Card>
                    </div>

                    <div className="absolute bottom-4 left-4">
                      <Card className="bg-white/90 backdrop-blur-sm">
                        <CardBody className="p-4">
                          <div className="text-sm text-default-600">
                            Processing Speed
                          </div>
                          <div className="text-2xl font-bold">2.3ms</div>
                          <div className="flex items-center gap-1 text-sm text-success">
                            <Icon icon="solar:arrow-up-outline" width={16} />
                            <span>99.9% accuracy</span>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-primary/20 blur-xl" />
              <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-secondary/20 blur-xl" />
            </m.div>
          </div>
        </LazyMotion>
      </div>
    </section>
  );
}
