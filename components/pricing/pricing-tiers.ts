import { FrequencyEnum, type Frequency, type Tier } from "./pricing-types";

export const frequencies: Frequency[] = [
  {
    key: FrequencyEnum.Yearly,
    label: "Pay Yearly",
    priceSuffix: "year",
  },
  {
    key: FrequencyEnum.Quarterly,
    label: "Pay Quarterly",
    priceSuffix: "quarter",
  },
];

export const tiers: Tier[] = [
  {
    key: "starter",
    title: "Starter",
    description: "Perfect for individuals and small teams getting started.",
    price: {
      [FrequencyEnum.Yearly]: "$99",
      [FrequencyEnum.Quarterly]: "$39",
    },
    href: "#",
    features: [
      "Up to 1,000 contacts",
      "Basic OCR scanning",
      "Email support",
      "Mobile app access",
      "Basic analytics",
    ],
    buttonText: "Get Started",
    buttonColor: "default",
    buttonVariant: "bordered",
  },
  {
    key: "professional",
    title: "Professional",
    description: "Ideal for growing businesses and teams.",
    price: {
      [FrequencyEnum.Yearly]: "$299",
      [FrequencyEnum.Quarterly]: "$99",
    },
    href: "#",
    mostPopular: true,
    features: [
      "Up to 10,000 contacts",
      "Advanced OCR with AI",
      "Priority email & chat support",
      "Team collaboration tools",
      "Advanced analytics & reporting",
      "Custom integrations",
      "Data export & backup",
    ],
    buttonText: "Start Free Trial",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
  {
    key: "enterprise",
    title: "Enterprise",
    description: "For large organizations with advanced needs.",
    price: "Custom",
    href: "#",
    features: [
      "Unlimited contacts",
      "Enterprise-grade OCR & AI",
      "24/7 phone & email support",
      "Advanced team management",
      "Custom analytics & reports",
      "API access & custom integrations",
      "On-premise deployment option",
      "Dedicated account manager",
    ],
    buttonText: "Contact Sales",
    buttonColor: "default",
    buttonVariant: "bordered",
  },
];
