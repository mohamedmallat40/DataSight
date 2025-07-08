"use client";

import React from "react";

import LandingNavbar from "./landing-navbar";
import HeroSection from "./hero-section";
import FeaturesSection from "./features-section";
import AISection from "./ai-section";
import CTASection from "./cta-section";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      {/* Navbar */}
      <LandingNavbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <div id="features">
          <FeaturesSection />
        </div>

        {/* AI Technology Section */}
        <div id="ai">
          <AISection />
        </div>

        {/* CTA Section */}
        <CTASection />
      </main>

      {/* Enhanced Footer */}
      <footer className="w-full border-t border-default-200/50 bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between py-8 px-6 max-w-7xl mx-auto gap-4">
          {/* Company Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 text-current">
              <span className="text-default-600">Powered by</span>
              <span className="text-primary font-semibold">Perla IT</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-default-300" />
            <span className="text-tiny text-default-500">
              © 2024 All Care Medical Group. All rights reserved.
            </span>
          </div>

          {/* Footer Links */}
          <div className="flex items-center gap-6 text-tiny">
            <a
              className="text-default-500 hover:text-foreground transition-colors"
              href="#privacy"
            >
              Privacy Policy
            </a>
            <a
              className="text-default-500 hover:text-foreground transition-colors"
              href="#terms"
            >
              Terms of Service
            </a>
            <a
              className="text-default-500 hover:text-foreground transition-colors"
              href="mailto:support@allcaremedical.com"
            >
              Support
            </a>
          </div>
        </div>
      </footer>

      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
      </div>
    </div>
  );
}
