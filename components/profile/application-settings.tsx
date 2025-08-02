"use client";

import type { CardProps } from "@heroui/react";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  RadioGroup,
  Radio,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";

import SwitchCell from "./switch-cell";

export default function ApplicationSettings(props: CardProps) {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Application settings saved:", {
      theme,
    });

    setIsLoading(false);
  };

  return (
    <Card className="max-w-4xl w-full" {...props}>
      <CardHeader className="flex flex-col items-start px-6 pb-0 pt-6">
        <div className="flex items-center gap-3 mb-2">
          <Icon
            className="text-primary"
            icon="solar:settings-linear"
            width={24}
          />
          <p className="text-xl font-semibold">Application Settings</p>
        </div>
        <p className="text-small text-default-500">
          Customize your application appearance and preferences
        </p>
      </CardHeader>

      <CardBody className="px-6 space-y-6">
        {/* Theme Settings */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon
              className="text-primary"
              icon="solar:palette-linear"
              width={20}
            />
            Appearance
          </h3>

          <div className="space-y-4">
            <div className="bg-content2 rounded-lg p-4">
              <div className="mb-4">
                <p className="font-medium">Theme Preference</p>
                <p className="text-small text-default-500">
                  Choose your preferred color scheme
                </p>
              </div>
              <RadioGroup
                classNames={{
                  wrapper: "gap-4",
                }}
                orientation="horizontal"
                value={theme || "light"}
                onValueChange={setTheme}
              >
                <Radio classNames={{ label: "text-small" }} value="light">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:sun-linear" width={16} />
                    Light
                  </div>
                </Radio>
                <Radio classNames={{ label: "text-small" }} value="dark">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:moon-linear" width={16} />
                    Dark
                  </div>
                </Radio>
                <Radio classNames={{ label: "text-small" }} value="system">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:monitor-linear" width={16} />
                    System
                  </div>
                </Radio>
              </RadioGroup>
            </div>

            <SwitchCell
              description="Minimize animations and transitions for better performance"
              label="Reduce Motion"
            />

            <SwitchCell
              defaultSelected
              description="Increase contrast for better visibility"
              label="High Contrast"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            color="primary"
            isLoading={isLoading}
            size="lg"
            startContent={
              !isLoading ? <Icon icon="solar:diskette-linear" /> : undefined
            }
            onPress={handleSaveSettings}
          >
            {isLoading ? "Saving Settings..." : "Save Settings"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
