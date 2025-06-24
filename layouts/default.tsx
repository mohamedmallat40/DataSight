import { Link } from "@heroui/link";
import { motion } from "framer-motion";

import { Head } from "./head";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden bg-background">
      <Head />

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
              href="https://www.perla-it.com"
              title="perla-it.com homepage"
            >
              <span className="text-default-600">Powered by</span>
              <span className="text-primary font-semibold">Perla IT</span>
            </Link>
            <div className="hidden sm:block w-px h-4 bg-default-300" />
            <span className="text-tiny text-default-500">
              © 2024 All Care Medical Group. All rights reserved.
            </span>
          </div>

          {/* Footer Links */}
          <div className="flex items-center gap-6 text-tiny">
            <Link
              className="text-default-500 hover:text-foreground transition-colors"
              href="/privacy"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-default-500 hover:text-foreground transition-colors"
              href="/terms"
            >
              Terms of Service
            </Link>
            <Link
              className="text-default-500 hover:text-foreground transition-colors"
              href="mailto:support@example.com"
            >
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
