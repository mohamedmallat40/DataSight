export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "PERLA code innovators",
  description: "We code the future togther.",
  navItems: [
    {
      label: "navbar_services",
      href: "#services_id",
    },
    {
      label: "navbar_technologies",
      href: "#technologies_id",
    },
    {
      label: "navbar_about",
      href: "#footer_id",
    },
  ],

  links: {
    sponsor: "https://www.linkedin.com/company/100257723",
  },
} as const;
