"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { LazyMotion, domAnimation, m } from "framer-motion";

const features = [
  {
    icon: "solar:brain-outline",
    title: "AI-Powered Insights",
    description:
      "Advanced machine learning algorithms analyze patient data to provide actionable insights and predictions.",
    color: "primary",
  },
  {
    icon: "solar:shield-check-outline",
    title: "HIPAA Compliant",
    description:
      "Bank-level security with end-to-end encryption ensures your patient data is always protected.",
    color: "success",
  },
  {
    icon: "solar:clock-circle-outline",
    title: "Real-time Sync",
    description:
      "Instant synchronization across all devices ensures your team has access to the latest information.",
    color: "warning",
  },
  {
    icon: "solar:chat-round-dots-outline",
    title: "Smart Communication",
    description:
      "AI-assisted communication tools help you stay connected with patients and team members.",
    color: "secondary",
  },
  {
    icon: "solar:graph-up-outline",
    title: "Analytics Dashboard",
    description:
      "Comprehensive analytics and reporting tools to track performance and identify opportunities.",
    color: "primary",
  },
  {
    icon: "solar:smartphone-2-outline",
    title: "Mobile Ready",
    description:
      "Access your healthcare management system anywhere, anytime with our responsive design.",
    color: "success",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-8">
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
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                All Care Medical?
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-default-600">
              Experience the power of AI-driven healthcare management with
              features designed to streamline your workflow and improve patient
              outcomes.
            </p>
          </m.div>

          {/* Features Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <m.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group h-full border-0 bg-default-50/50 backdrop-blur-sm transition-all duration-300 hover:bg-default-100/50 hover:shadow-lg hover:-translate-y-2">
                  <CardBody className="p-8">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 transition-all duration-300 group-hover:scale-110">
                      <Icon
                        className={`text-${feature.color} text-2xl`}
                        icon={feature.icon}
                        width={32}
                      />
                    </div>
                    <h3 className="mb-4 text-xl font-bold">{feature.title}</h3>
                    <p className="text-default-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              </m.div>
            ))}
          </div>
        </LazyMotion>
      </div>
    </section>
  );
}
