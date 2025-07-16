import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

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
      <footer className="w-full bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🔥</span>
                <span className="font-bold text-lg">Perla Code Innovators</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Expert software development and innovative technology solutions
                for modern businesses.
              </p>
              <div className="space-y-2 text-gray-300 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:location-linear" width={16} />
                  <span>AV Hedi Khfacha 2023. Ariana, Tunis, Tunisia</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="solar:letter-linear" width={16} />
                  <a
                    href="mailto:mo.mallat@perla-it.com"
                    className="hover:text-orange-400 transition-colors"
                  >
                    mo.mallat@perla-it.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="solar:calendar-linear" width={16} />
                  <a
                    href="https://calendly.com/perla-ci"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Schedule Meeting
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                >
                  <Icon icon="solar:facebook-linear" width={16} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                >
                  <Icon icon="solar:twitter-linear" width={16} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                >
                  <Icon icon="solar:linkedin-linear" width={16} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                >
                  <Icon icon="solar:github-linear" width={16} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>support@convents.com</li>
                <li>+1 (555) 123-4567</li>
                <li>
                  123 Business Street
                  <br />
                  Suite 100
                  <br />
                  City, State 12345
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Perla Code Innovators. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <a
                href="#"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <Icon icon="solar:shield-check-linear" width={14} />
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <Icon icon="solar:document-text-linear" width={14} />
                Terms
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <Icon icon="solar:settings-linear" width={14} />
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
