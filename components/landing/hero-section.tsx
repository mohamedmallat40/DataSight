"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { useRouter } from "next/router";

export default function HeroSection() {
  const router = useRouter();

  const handleGetStarted = () => {
    const event = new CustomEvent("openRegister");
    window.dispatchEvent(event);
  };

  const handleViewDemo = () => {
    router.push("/contacts");
  };

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 sm:px-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-success/5 blur-2xl" />
      </div>

      <div className="relative z-10 flex max-w-6xl flex-col items-center text-center">
        {/* AI Badge */}
        <LazyMotion features={domAnimation}>
          <m.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Button
              className="mb-8 h-9 overflow-hidden border-1 border-primary/20 bg-primary/5 px-6 py-2 text-small font-medium text-primary backdrop-blur-sm"
              endContent={
                <Icon
                  className="text-primary"
                  icon="solar:stars-minimalistic-outline"
                  width={16}
                />
              }
              radius="full"
              variant="bordered"
            >
              🤖 Powered by Advanced AI
            </Button>
          </m.div>

          {/* Main Headline */}
          <m.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-4xl font-bold leading-tight tracking-tight text-transparent sm:text-5xl lg:text-7xl">
              Intelligent Healthcare
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Management
              </span>
            </h1>
          </m.div>

          {/* Description */}
          <m.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-default-600 sm:text-xl">
              Transform your medical practice with AI-powered contact
              management, automated patient insights, and intelligent workflow
              optimization. Experience the future of healthcare administration.
            </p>
          </m.div>

          {/* CTA Buttons */}
          <m.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 sm:flex-row sm:gap-6"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              className="h-14 bg-gradient-to-r from-primary to-secondary px-8 text-base font-semibold text-white shadow-lg hover:shadow-xl"
              radius="full"
              size="lg"
              onPress={handleGetStarted}
            >
              <Icon icon="solar:rocket-2-outline" width={20} />
              Start Free Trial
            </Button>
            <Button
              className="h-14 border-2 border-default-200 px-8 text-base font-semibold backdrop-blur-sm hover:bg-default-50"
              radius="full"
              size="lg"
              variant="bordered"
              onPress={handleViewDemo}
            >
              <Icon icon="solar:play-circle-outline" width={20} />
              View Live Demo
            </Button>
          </m.div>

          {/* Stats */}
          <m.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-default-500">Uptime Guaranteed</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-success">50k+</div>
              <div className="text-sm text-default-500">Patients Managed</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-secondary">24/7</div>
              <div className="text-sm text-default-500">AI Support</div>
            </div>
          </m.div>
        </LazyMotion>
      </div>

      {/* Floating Elements */}
      <div className="absolute right-10 top-20 hidden animate-bounce lg:block">
        <div className="rounded-2xl bg-primary/10 p-4 backdrop-blur-sm">
          <Icon
            className="text-primary"
            icon="solar:health-outline"
            width={32}
          />
        </div>
      </div>
      <div className="absolute left-10 bottom-32 hidden animate-pulse lg:block">
        <div className="rounded-2xl bg-success/10 p-4 backdrop-blur-sm">
          <Icon
            className="text-success"
            icon="solar:database-outline"
            width={32}
          />
        </div>
      </div>
    </section>
  );
}
