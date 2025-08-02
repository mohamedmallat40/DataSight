"use client";

import type { CardProps } from "@heroui/react";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
  Progress,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import CellWrapper from "./cell-wrapper";

// Mock subscription data
const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Up to 100 contacts",
      "Basic analytics",
      "Email support",
      "Standard templates",
    ],
    limitations: ["Limited exports", "No API access", "Basic reporting"],
  },
  {
    id: "pro",
    name: "Professional",
    price: "$29",
    period: "per month",
    features: [
      "Up to 10,000 contacts",
      "Advanced analytics",
      "Priority support",
      "Custom templates",
      "API access",
      "Advanced reporting",
      "Team collaboration",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    period: "per month",
    features: [
      "Unlimited contacts",
      "Enterprise analytics",
      "24/7 phone support",
      "Custom integrations",
      "Advanced security",
      "Custom training",
      "Dedicated account manager",
    ],
  },
];

const currentSubscription = {
  plan: "pro",
  status: "active",
  nextBilling: "2024-02-15",
  usage: {
    contacts: 2450,
    limit: 10000,
    apiCalls: 15240,
    apiLimit: 50000,
  },
};

export default function SubscriptionSettings(props: CardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanChange = async (planId: string) => {
    setSelectedPlan(planId);
    onOpen();
  };

  const confirmPlanChange = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Changing to plan:", selectedPlan);
    setIsLoading(false);
    onOpenChange();
  };

  const currentPlan = subscriptionPlans.find(
    (plan) => plan.id === currentSubscription.plan,
  );

  return (
    <>
      <Card className="max-w-4xl w-full" {...props}>
        <CardHeader className="flex flex-col items-start px-6 pb-0 pt-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon
              className="text-primary"
              icon="solar:crown-linear"
              width={24}
            />
            <p className="text-xl font-semibold">Subscription Management</p>
          </div>
          <p className="text-small text-default-500">
            Manage your subscription plan and billing information
          </p>
        </CardHeader>

        <CardBody className="px-6 space-y-6">
          {/* Current Plan */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Current Plan</h3>
            <CellWrapper className="bg-gradient-to-r from-primary/10 to-secondary/10 border-1 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon
                    className="text-primary"
                    icon="solar:crown-bold"
                    width={24}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">
                      {currentPlan?.name}
                    </h4>
                    {currentPlan?.popular && (
                      <Chip color="primary" size="sm" variant="flat">
                        Popular
                      </Chip>
                    )}
                  </div>
                  <p className="text-small text-default-500">
                    {currentPlan?.price} {currentPlan?.period}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Chip
                  color={
                    currentSubscription.status === "active"
                      ? "success"
                      : "warning"
                  }
                  size="sm"
                  variant="flat"
                >
                  {currentSubscription.status}
                </Chip>
                <Button
                  color="primary"
                  size="sm"
                  startContent={<Icon icon="solar:card-linear" />}
                  variant="bordered"
                >
                  Manage Billing
                </Button>
              </div>
            </CellWrapper>
          </div>

          {/* Usage Statistics */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Usage This Month</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-small font-medium">Contacts</span>
                  <span className="text-small text-default-500">
                    {currentSubscription.usage.contacts.toLocaleString()} /{" "}
                    {currentSubscription.usage.limit.toLocaleString()}
                  </span>
                </div>
                <Progress
                  className="mb-2"
                  color="primary"
                  value={
                    (currentSubscription.usage.contacts /
                      currentSubscription.usage.limit) *
                    100
                  }
                />
                <p className="text-tiny text-default-400">
                  {Math.round(
                    ((currentSubscription.usage.limit -
                      currentSubscription.usage.contacts) /
                      currentSubscription.usage.limit) *
                      100,
                  )}
                  % remaining
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-small font-medium">API Calls</span>
                  <span className="text-small text-default-500">
                    {currentSubscription.usage.apiCalls.toLocaleString()} /{" "}
                    {currentSubscription.usage.apiLimit.toLocaleString()}
                  </span>
                </div>
                <Progress
                  className="mb-2"
                  color="secondary"
                  value={
                    (currentSubscription.usage.apiCalls /
                      currentSubscription.usage.apiLimit) *
                    100
                  }
                />
                <p className="text-tiny text-default-400">
                  {Math.round(
                    ((currentSubscription.usage.apiLimit -
                      currentSubscription.usage.apiCalls) /
                      currentSubscription.usage.apiLimit) *
                      100,
                  )}
                  % remaining
                </p>
              </Card>
            </div>
          </div>

          <Divider />

          {/* Available Plans */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {subscriptionPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`p-4 ${plan.id === currentSubscription.plan ? "border-2 border-primary" : ""} ${plan.popular ? "border-2 border-secondary" : ""}`}
                >
                  <div className="text-center mb-4">
                    {plan.popular && (
                      <Chip
                        className="mb-2"
                        color="secondary"
                        size="sm"
                        variant="flat"
                      >
                        Most Popular
                      </Chip>
                    )}
                    <h4 className="font-semibold text-lg">{plan.name}</h4>
                    <div className="flex items-baseline justify-center gap-1 mt-2">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      <span className="text-small text-default-500">
                        /{plan.period}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-small"
                      >
                        <Icon
                          className="text-success"
                          icon="solar:check-circle-linear"
                          width={16}
                        />
                        {feature}
                      </li>
                    ))}
                    {plan.limitations?.map((limitation, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-small text-default-400"
                      >
                        <Icon
                          className="text-default-400"
                          icon="solar:close-circle-linear"
                          width={16}
                        />
                        {limitation}
                      </li>
                    ))}
                  </ul>

                  <Button
                    fullWidth
                    color={
                      plan.id === currentSubscription.plan
                        ? "default"
                        : "primary"
                    }
                    disabled={plan.id === currentSubscription.plan}
                    variant={
                      plan.id === currentSubscription.plan
                        ? "bordered"
                        : "solid"
                    }
                    onPress={() => handlePlanChange(plan.id)}
                  >
                    {plan.id === currentSubscription.plan
                      ? "Current Plan"
                      : `Upgrade to ${plan.name}`}
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Billing Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
            <div className="space-y-3">
              <CellWrapper>
                <div>
                  <p className="font-medium">Next Billing Date</p>
                  <p className="text-small text-default-500">
                    {new Date(
                      currentSubscription.nextBilling,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <Chip color="success" size="sm" variant="flat">
                  Auto-renewal enabled
                </Chip>
              </CellWrapper>

              <CellWrapper>
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-small text-default-500">
                    •••• •••• •••• 4242
                  </p>
                </div>
                <Button
                  size="sm"
                  startContent={<Icon icon="solar:pen-2-linear" />}
                  variant="bordered"
                >
                  Update
                </Button>
              </CellWrapper>

              <CellWrapper>
                <div>
                  <p className="font-medium">Billing Address</p>
                  <p className="text-small text-default-500">
                    123 Business St, City, State 12345
                  </p>
                </div>
                <Button
                  size="sm"
                  startContent={<Icon icon="solar:pen-2-linear" />}
                  variant="bordered"
                >
                  Edit
                </Button>
              </CellWrapper>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Plan Change Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon
                    className="text-primary"
                    icon="solar:crown-linear"
                    width={20}
                  />
                  <span>Confirm Plan Change</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to change your subscription to the{" "}
                  <strong>
                    {subscriptionPlans.find((p) => p.id === selectedPlan)?.name}
                  </strong>{" "}
                  plan?
                </p>
                <p className="text-small text-default-500">
                  The change will take effect immediately and you'll be billed
                  pro-rata for the current billing period.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  onPress={confirmPlanChange}
                >
                  {isLoading ? "Processing..." : "Confirm Change"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
