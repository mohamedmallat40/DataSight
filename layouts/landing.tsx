import { motion } from "framer-motion";

import { Head } from "./head";
import { LandingNavbar } from "@/components/landing-navbar";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden bg-background">
      <Head />
      <LandingNavbar />

      {/* Main Content with smooth animation */}
      <motion.main
        animate={{ opacity: 1, y: 0 }}
        className="flex-grow"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.main>

      {/* Landing Page Footer */}
      <footer className="w-full border-t border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-sm mt-16">
        <div className="flex flex-col sm:flex-row items-center justify-between py-8 px-6 max-w-7xl mx-auto gap-4">
          {/* Company Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SmartCMS
              </p>
              <p className="text-sm text-default-600">
                AI-Powered Contact Management with OCR Technology
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              className="text-default-500 hover:text-primary transition-colors"
              href="#privacy"
            >
              Privacy Policy
            </a>
            <a
              className="text-default-500 hover:text-primary transition-colors"
              href="#terms"
            >
              Terms of Service
            </a>
            <a
              className="text-default-500 hover:text-primary transition-colors"
              href="mailto:support@allcaremedical.com"
            >
              Support
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/10">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 px-6 max-w-7xl mx-auto gap-2">
            <p className="text-xs text-default-500">
              © 2024 All Care Medical Group. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-default-500">
              <span>Powered by</span>
              <a
                href="https://www.perla-it.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors font-medium"
              >
                Perla IT
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
