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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Application settings saved:", {
      theme
    });
    
    setIsLoading(false);
  };

  return (
    <Card className="max-w-4xl w-full" {...props}>
      <CardHeader className="flex flex-col items-start px-6 pb-0 pt-6">
        <div className="flex items-center gap-3 mb-2">
          <Icon icon="solar:settings-linear" className="text-primary" width={24} />
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
            <Icon icon="solar:palette-linear" className="text-primary" width={20} />
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
                orientation="horizontal"
                value={theme || "light"}
                onValueChange={setTheme}
                classNames={{
                  wrapper: "gap-4"
                }}
              >
                <Radio value="light" classNames={{ label: "text-small" }}>
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:sun-linear" width={16} />
                    Light
                  </div>
                </Radio>
                <Radio value="dark" classNames={{ label: "text-small" }}>
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:moon-linear" width={16} />
                    Dark
                  </div>
                </Radio>
                <Radio value="system" classNames={{ label: "text-small" }}>
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:monitor-linear" width={16} />
                    System
                  </div>
                </Radio>
              </RadioGroup>
            </div>

            <SwitchCell
              label="Reduce Motion"
              description="Minimize animations and transitions for better performance"
            />

            <SwitchCell
              defaultSelected
              label="High Contrast"
              description="Increase contrast for better visibility"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            color="primary"
            size="lg"
            isLoading={isLoading}
            onPress={handleSaveSettings}
            startContent={!isLoading ? <Icon icon="solar:diskette-linear" /> : undefined}
          >
            {isLoading ? "Saving Settings..." : "Save Settings"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}