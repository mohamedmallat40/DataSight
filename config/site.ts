export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "ALL CARE MEDICAL - OCR Contact Management System",
  description:
    "Transform your business cards and documents into actionable data instantly with our AI-powered OCR contact management system. Advanced scanning, smart organization, and seamless workflow automation.",
  keywords:
    "OCR, contact management, business cards, document scanning, AI automation, CRM, healthcare management, digital transformation, document processing, contact organization",
  url: "https://allcaremedical.com",
  ogImage: "/og-image.jpg",
  company: "ALL CARE MEDICAL",
  slogan: "OCR Contact Management",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Features",
      href: "#features",
    },
    {
      label: "Pricing",
      href: "#pricing",
    },
    {
      label: "About",
      href: "#about",
    },
    {
      label: "Contact",
      href: "#contact",
    },
  ],
  links: {
    linkedin: "https://www.linkedin.com/company/allcaremedical",
    contact: "mailto:info@allcaremedical.com",
    support: "mailto:support@allcaremedical.com",
  },
} as const;
