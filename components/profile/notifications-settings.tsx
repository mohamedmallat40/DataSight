"use client";

import type { CardProps } from "@heroui/react";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Select,
  SelectItem,
  Divider,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import SwitchCell from "./switch-cell";
import CellWrapper from "./cell-wrapper";

const notificationTimes = [
  { value: "instant", label: "Instantly" },
  { value: "5min", label: "Every 5 minutes" },
  { value: "15min", label: "Every 15 minutes" },
  { value: "30min", label: "Every 30 minutes" },
  { value: "1hour", label: "Every hour" },
  { value: "daily", label: "Daily digest" },
  { value: "weekly", label: "Weekly digest" },
];

const emailFrequency = [
  { value: "all", label: "All notifications" },
  { value: "important", label: "Important only" },
  { value: "weekly", label: "Weekly summary" },
  { value: "never", label: "Never" },
];

export default function NotificationsSettings(props: CardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSettings, setEmailSettings] = useState("important");
  const [digestTime, setDigestTime] = useState("daily");

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Notification settings saved");
    setIsLoading(false);
  };

  const handleResetToDefault = () => {
    // Reset all switches to default state
    console.log("Reset to default settings");
  };

  return (
    <Card className="w-full max-w-4xl" {...props}>
      <CardHeader className="flex flex-col items-start px-6 pb-0 pt-6">
        <div className="flex items-center gap-3 mb-2">
          <Icon icon="solar:bell-linear" className="text-primary" width={24} />
          <p className="text-xl font-semibold">Notification Settings</p>
        </div>
        <p className="text-small text-default-500">
          Manage your notification preferences and communication settings
        </p>
      </CardHeader>

      <CardBody className="px-6 space-y-6">
        {/* Global Controls */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon icon="solar:settings-linear" className="text-primary" width={20} />
            Global Controls
          </h3>
          <div className="space-y-4">
            <SwitchCell 
              label="Pause All Notifications" 
              description="Temporarily disable all notifications across all channels"
            />
            
            <SwitchCell
              defaultSelected
              label="Do Not Disturb Mode"
              description="Pause notifications during your working hours (9 AM - 6 PM)"
            />

            <CellWrapper>
              <div>
                <p className="font-medium">Notification Frequency</p>
                <p className="text-small text-default-500">
                  How often you want to receive bundled notifications
                </p>
              </div>
              <Select
                className="max-w-xs"
                selectedKeys={[digestTime]}
                onSelectionChange={(keys) => setDigestTime(Array.from(keys)[0] as string)}
              >
                {notificationTimes.map((time) => (
                  <SelectItem key={time.value} value={time.value}>
                    {time.label}
                  </SelectItem>
                ))}
              </Select>
            </CellWrapper>
          </div>
        </div>

        <Divider />

        {/* Contact Management */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon icon="solar:users-group-rounded-linear" className="text-primary" width={20} />
            Contact Management
          </h3>
          <div className="space-y-4">
            <SwitchCell
              defaultSelected
              label="New Contact Added" 
              description="Get notified when a new contact is added to your database"
            />
            
            <SwitchCell
              defaultSelected
              label="Contact Updates"
              description="Get notified when contact information is modified"
            />
            
            <SwitchCell
              label="Bulk Operations"
              description="Get notified about the completion of bulk import/export operations"
            />

            <SwitchCell
              defaultSelected
              label="Data Quality Alerts"
              description="Get notified about potential duplicate contacts or data inconsistencies"
            />
          </div>
        </div>

        <Divider />

        {/* System & Security */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon icon="solar:shield-check-linear" className="text-primary" width={20} />
            System & Security
          </h3>
          <div className="space-y-4">
            <SwitchCell
              defaultSelected
              label="Login Alerts"
              description="Get notified when someone logs into your account"
            />
            
            <SwitchCell
              defaultSelected
              label="Security Updates"
              description="Get notified about important security updates and patches"
            />
            
            <SwitchCell
              label="System Maintenance"
              description="Get notified about scheduled maintenance and downtime"
            />

            <SwitchCell
              defaultSelected
              label="Unusual Activity"
              description="Get notified about suspicious or unusual account activity"
            />
          </div>
        </div>

        <Divider />

        {/* Subscription & Billing */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon icon="solar:crown-linear" className="text-primary" width={20} />
            Subscription & Billing
          </h3>
          <div className="space-y-4">
            <SwitchCell
              defaultSelected
              label="Payment Notifications"
              description="Get notified about successful payments and billing issues"
            />
            
            <SwitchCell
              defaultSelected
              label="Usage Limits"
              description="Get notified when you're approaching your plan limits"
            />
            
            <SwitchCell
              label="Plan Recommendations"
              description="Get suggestions about plan upgrades based on your usage"
            />

            <SwitchCell
              defaultSelected
              label="Renewal Reminders"
              description="Get reminded before your subscription renews"
            />
          </div>
        </div>

        <Divider />

        {/* Communication Channels */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon icon="solar:letter-linear" className="text-primary" width={20} />
            Communication Channels
          </h3>
          <div className="space-y-4">
            <CellWrapper>
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-small text-default-500">
                  john.doe@example.com
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Chip color="success" variant="flat" size="sm">
                  Verified
                </Chip>
                <Select
                  className="max-w-xs"
                  selectedKeys={[emailSettings]}
                  onSelectionChange={(keys) => setEmailSettings(Array.from(keys)[0] as string)}
                >
                  {emailFrequency.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </CellWrapper>

            <SwitchCell
              defaultSelected
              label="Browser Notifications"
              description="Show desktop notifications when the app is open"
            />

            <SwitchCell
              label="Push Notifications"
              description="Receive notifications on your mobile device (requires mobile app)"
            />

            <CellWrapper>
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-small text-default-500">
                  For critical alerts only
                </p>
              </div>
              <Button
                variant="bordered"
                size="sm"
                startContent={<Icon icon="solar:phone-linear" />}
              >
                Add Phone
              </Button>
            </CellWrapper>
          </div>
        </div>

        <Divider />

        {/* Advanced Settings */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon icon="solar:settings-2-linear" className="text-primary" width={20} />
            Advanced Settings
          </h3>
          <div className="space-y-4">
            <SwitchCell
              label="Notification Sound"
              description="Play a sound when receiving notifications"
            />

            <SwitchCell
              defaultSelected
              label="Smart Grouping"
              description="Group related notifications together to reduce noise"
            />

            <CellWrapper>
              <div>
                <p className="font-medium">Notification History</p>
                <p className="text-small text-default-500">
                  Keep notification history for 30 days
                </p>
              </div>
              <Button
                variant="bordered"
                size="sm"
                startContent={<Icon icon="solar:eye-linear" />}
              >
                View History
              </Button>
            </CellWrapper>

            <CellWrapper>
              <div>
                <p className="font-medium">Export Preferences</p>
                <p className="text-small text-default-500">
                  Export your notification settings
                </p>
              </div>
              <Button
                variant="bordered"
                size="sm"
                startContent={<Icon icon="solar:download-linear" />}
              >
                Export
              </Button>
            </CellWrapper>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full justify-end gap-3 pt-4">
          <Button 
            variant="bordered"
            startContent={<Icon icon="solar:restart-linear" />}
            onPress={handleResetToDefault}
          >
            Reset to Default
          </Button>
          <Button 
            color="primary" 
            isLoading={isLoading}
            onPress={handleSaveSettings}
            startContent={!isLoading ? <Icon icon="solar:diskette-linear" /> : undefined}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}