import { Link } from "@heroui/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const [locale, setLocale] = useState("en");

  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden bg-background">
      <Head />
      <Navbar setLocale={setLocale} />

      {/* Main Content with smooth animation */}
      <motion.main
        animate={{ opacity: 1, y: 0 }}
        className="mx-2.5 flex-grow pt-4"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.main>

      {/* Enhanced Footer */}
      <footer className="w-full border-t border-default-200/50 bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 px-4 max-w-7xl mx-auto gap-4">
          {/* Company Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              isExternal
              className="flex items-center gap-2 text-current hover:text-primary transition-colors"
              href="https://www.perla-code.com"
              title="Perla Code Innovators"
            >
              <span className="text-2xl">🔥</span>
              <span className="text-primary font-semibold">
                Perla Code Innovators
              </span>
            </Link>
            <div className="hidden sm:block w-px h-4 bg-default-300" />
            <div className="text-tiny text-default-500 text-center sm:text-left">
              <p>© 2024 PERLA Code Innovators. All rights reserved.</p>
              <p>AV Hedi Khfacha 2023. Ariana, Tunis, Tunisia</p>
            </div>
          </div>

          {/* Contact & Footer Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-tiny">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <Link
                className="text-default-600 hover:text-primary transition-colors font-medium flex items-center gap-2"
                href="mailto:mo.mallat@perla-it.com"
              >
                <Icon
                  className="w-4 h-4 text-primary"
                  icon="solar:letter-linear"
                />
                mo.mallat@perla-it.com
              </Link>
              <Link
                className="text-default-600 hover:text-primary transition-colors font-medium flex items-center gap-2"
                href="https://calendly.com/perla-ci"
              >
                <Icon
                  className="w-4 h-4 text-primary"
                  icon="solar:calendar-linear"
                />
                Schedule Meeting
              </Link>
            </div>
            <div className="hidden sm:block w-px h-4 bg-default-300" />
            <div className="flex items-center gap-6">
              <Link
                className="text-default-500 hover:text-foreground transition-colors flex items-center gap-1"
                href="/privacy"
              >
                <Icon className="w-3 h-3" icon="solar:shield-check-linear" />
                Privacy
              </Link>
              <Link
                className="text-default-500 hover:text-foreground transition-colors flex items-center gap-1"
                href="/terms"
              >
                <Icon className="w-3 h-3" icon="solar:document-text-linear" />
                Terms
              </Link>
              <Link
                className="text-default-500 hover:text-foreground transition-colors flex items-center gap-1"
                href="mailto:mo.mallat@perla-it.com"
              >
                <Icon className="w-3 h-3" icon="solar:letter-linear" />
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
