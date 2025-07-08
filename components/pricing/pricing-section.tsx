"use client";

import React from "react";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Link,
  Spacer,
  Tab,
  Tabs,
} from "@heroui/react";
import { cn } from "@heroui/react";

import { FrequencyEnum } from "./pricing-types";
import { frequencies, tiers } from "./pricing-tiers";

export default function PricingSection() {
  const [selectedFrequency, setSelectedFrequency] = React.useState(
    frequencies[0],
  );

  const onFrequencyChange = (selectedKey: React.Key) => {
    const frequencyIndex = frequencies.findIndex((f) => f.key === selectedKey);

    setSelectedFrequency(frequencies[frequencyIndex]);
  };

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center py-20">
      <div className="flex max-w-2xl flex-col text-center">
        <Chip
          variant="flat"
          color="primary"
          className="mb-4 bg-primary/10 text-primary"
        >
          Pricing Plans
        </Chip>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
          Get unlimited access
        </h1>
        <Spacer y={4} />
        <h2 className="text-lg text-default-500 leading-relaxed">
          Discover the ideal plan for your business needs, starting at under $2
          per week.
        </h2>
      </div>
      <Spacer y={12} />
      <Tabs
        classNames={{
          tab: "data-[hover-unselected=true]:opacity-90",
        }}
        radius="full"
        size="lg"
        color="primary"
        onSelectionChange={onFrequencyChange}
      >
        <Tab
          key={FrequencyEnum.Yearly}
          aria-label="Pay Yearly"
          className="pr-1.5"
          title={
            <div className="flex items-center gap-2">
              <p>Pay Yearly</p>
              <Chip color="primary" size="sm">
                Save 25%
              </Chip>
            </div>
          }
        />
        <Tab key={FrequencyEnum.Quarterly} title="Pay Quarterly" />
      </Tabs>
      <Spacer y={12} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {tiers.map((tier) => (
          <Card
            key={tier.key}
            className={cn("relative", {
              "border-2 border-primary shadow-xl shadow-primary/20":
                tier.mostPopular,
              "border-1 border-divider": !tier.mostPopular,
            })}
          >
            {tier.mostPopular ? (
              <Chip
                classNames={{
                  base: "absolute -top-3 left-1/2 -translate-x-1/2",
                  content: "font-medium",
                }}
                color="primary"
                variant="solid"
              >
                Most Popular
              </Chip>
            ) : null}
            <CardHeader className="flex flex-col items-start gap-2 pb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {tier.title}
              </h2>
              <p className="text-medium text-default-500">{tier.description}</p>
            </CardHeader>
            <Divider />
            <CardBody className="gap-8">
              <p className="flex items-baseline gap-1 pt-2">
                <span className="inline bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-4xl font-bold leading-7 tracking-tight text-transparent">
                  {typeof tier.price === "string"
                    ? tier.price
                    : tier.price[selectedFrequency.key]}
                </span>
                {typeof tier.price !== "string" ? (
                  <span className="text-small font-medium text-default-400">
                    /{selectedFrequency.priceSuffix}
                  </span>
                ) : null}
              </p>
              <ul className="flex flex-col gap-3">
                {tier.features?.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Icon
                      className="text-success flex-shrink-0"
                      icon="solar:check-circle-linear"
                      width={20}
                    />
                    <p className="text-default-600 text-sm">{feature}</p>
                  </li>
                ))}
              </ul>
            </CardBody>
            <CardFooter>
              <Button
                fullWidth
                as={Link}
                color={tier.buttonColor}
                href={tier.href}
                variant={tier.buttonVariant}
                radius="full"
                className="font-medium"
              >
                {tier.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Spacer y={12} />
      <div className="flex py-2">
        <p className="text-default-400 text-center">
          Are you an open source developer?{" "}
          <Link color="primary" href="#" underline="always">
            Get a discount
          </Link>
        </p>
      </div>
    </div>
  );
}
