"use client";

import React from "react";
import { Card, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";

import DefaultLayout from "@/layouts/default";
import AccountDetails from "@/components/profile/account-details";
import SubscriptionSettings from "@/components/profile/subscription-settings";
import ApplicationSettings from "@/components/profile/application-settings";

export default function ProfilePage() {
  return (
    <DefaultLayout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Profile Settings
          </h1>
          <p className="text-lg text-default-600">
            Manage your account, subscription, and application preferences
          </p>
        </div>

        <Card className="w-full">
          <Tabs
            classNames={{
              tabList: "mx-6 mt-6 text-medium",
              tabContent: "text-small p-0",
              panel: "pb-6",
            }}
            size="lg"
            variant="underlined"
          >
            <Tab
              key="account-settings"
              textValue="Account Settings"
              title={
                <div className="flex items-center gap-1.5">
                  <Icon icon="solar:user-id-bold" width={20} />
                  <p>Account</p>
                </div>
              }
            >
              <AccountDetails className="mx-6 mt-4 shadow-none" />
            </Tab>

            <Tab
              key="subscription-settings"
              textValue="Subscription Settings"
              title={
                <div className="flex items-center gap-1.5">
                  <Icon icon="solar:crown-bold" width={20} />
                  <p>Subscription</p>
                </div>
              }
            >
              <SubscriptionSettings className="mx-6 mt-4 shadow-none" />
            </Tab>

            <Tab
              key="application-settings"
              textValue="Application Settings"
              title={
                <div className="flex items-center gap-1.5">
                  <Icon icon="solar:settings-bold" width={20} />
                  <p>Settings</p>
                </div>
              }
            >
              <ApplicationSettings className="mx-6 mt-4 shadow-none" />
            </Tab>
          </Tabs>
        </Card>
      </div>
    </DefaultLayout>
  );
}
