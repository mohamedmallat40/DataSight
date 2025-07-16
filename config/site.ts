export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "PERLA CI - Code Innovation Solutions",
  description:
    "Expert software development and innovative technology solutions for modern businesses. Transform your ideas into powerful digital solutions with our cutting-edge development services.",
  keywords:
    "software development, web development, mobile apps, custom software, digital transformation, technology solutions, code innovation, programming services, software consulting",
  url: "https://perla-code.com",
  ogImage: "/og-image.jpg",
  company: "PERLA CI",
  slogan: "Code Innovation Solutions",
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
    linkedin: "https://www.linkedin.com/company/perla-code-innovators",
    contact: "mailto:contact@perla-code.com",
    support: "mailto:support@perla-code.com",
    sponsor: "https://perla-code.com/contact",
  },
} as const;
