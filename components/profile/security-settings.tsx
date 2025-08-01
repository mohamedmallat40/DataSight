"use client";

import type { CardProps } from "@heroui/react";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import SwitchCell from "./switch-cell";
import CellWrapper from "./cell-wrapper";

export default function SecuritySettings(props: CardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen: isPasswordModalOpen, onOpen: onPasswordModalOpen, onOpenChange: onPasswordModalOpenChange } = useDisclosure();
  const { isOpen: is2FAModalOpen, onOpen: on2FAModalOpen, onOpenChange: on2FAModalOpenChange } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalOpenChange } = useDisclosure();

  const handleChangePassword = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    onPasswordModalOpenChange();
  };

  const handleSetup2FA = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    on2FAModalOpenChange();
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsLoading(false);
    onDeleteModalOpenChange();
  };

  return (
    <>
      <Card className="w-full max-w-4xl" {...props}>
        <CardHeader className="flex flex-col items-start px-6 pb-0 pt-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon icon="solar:shield-check-linear" className="text-primary" width={24} />
            <p className="text-xl font-semibold">Security Settings</p>
          </div>
          <p className="text-small text-default-500">
            Manage your account security and privacy preferences
          </p>
        </CardHeader>

        <CardBody className="px-6 space-y-6">
          {/* Account Security */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon icon="solar:key-linear" className="text-primary" width={20} />
              Account Security
            </h3>
            <div className="space-y-4">
              {/* Email */}
              <CellWrapper>
                <div>
                  <p className="font-medium">Email Address</p>
                  <p className="text-small text-default-500">
                    The email address associated with your account.
                  </p>
                </div>
                <div className="flex w-full flex-wrap items-center justify-end gap-6 sm:w-auto sm:flex-nowrap">
                  <div className="flex flex-col items-end">
                    <p className="font-medium">john.doe@mail.com</p>
                    <Chip color="success" variant="flat" size="sm">
                      Verified
                    </Chip>
                  </div>
                  <Button
                    endContent={<Icon icon="solar:pen-2-linear" />}
                    radius="full"
                    variant="bordered"
                    size="sm"
                  >
                    Edit
                  </Button>
                </div>
              </CellWrapper>

              {/* Password */}
              <CellWrapper>
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-small text-default-500">
                    Set a unique password to protect your account.
                  </p>
                </div>
                <Button 
                  radius="full" 
                  variant="bordered"
                  size="sm"
                  onPress={onPasswordModalOpen}
                  startContent={<Icon icon="solar:lock-password-linear" />}
                >
                  Change
                </Button>
              </CellWrapper>

              {/* Two-Factor Authentication */}
              <CellWrapper>
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-small text-default-500">
                    Add an extra layer of security to your account.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Chip color="warning" variant="flat" size="sm">
                    Not Enabled
                  </Chip>
                  <Button
                    color="primary"
                    radius="full"
                    variant="bordered"
                    size="sm"
                    onPress={on2FAModalOpen}
                    startContent={<Icon icon="solar:shield-plus-linear" />}
                  >
                    Enable
                  </Button>
                </div>
              </CellWrapper>
            </div>
          </div>

          <Divider />

          {/* Security Preferences */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon icon="solar:settings-linear" className="text-primary" width={20} />
              Security Preferences
            </h3>
            <div className="space-y-4">
              <SwitchCell
                defaultSelected
                label="Password Reset Protection"
                description="Require additional verification to reset your password"
              />

              <SwitchCell
                defaultSelected
                label="Login Notifications"
                description="Get notified via email when someone logs into your account"
              />

              <SwitchCell
                label="Require PIN for Sensitive Actions"
                description="Require a PIN to access sensitive account functions"
              />

              <SwitchCell
                defaultSelected
                label="Session Timeout"
                description="Automatically log out after 30 minutes of inactivity"
              />
            </div>
          </div>

          <Divider />

          {/* Privacy Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon icon="solar:eye-closed-linear" className="text-primary" width={20} />
              Privacy Settings
            </h3>
            <div className="space-y-4">
              <SwitchCell
                label="Profile Visibility"
                description="Make your profile visible to other users in the organization"
              />

              <SwitchCell
                defaultSelected
                label="Activity Status"
                description="Show when you were last active"
              />

              <SwitchCell
                label="Data Analytics"
                description="Allow anonymous usage data to be collected for analytics"
              />

              <CellWrapper>
                <div>
                  <p className="font-medium">Data Export</p>
                  <p className="text-small text-default-500">
                    Download all your personal data in a portable format
                  </p>
                </div>
                <Button
                  variant="bordered"
                  size="sm"
                  startContent={<Icon icon="solar:download-linear" />}
                >
                  Export Data
                </Button>
              </CellWrapper>
            </div>
          </div>

          <Divider />

          {/* Active Sessions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon icon="solar:monitor-linear" className="text-primary" width={20} />
              Active Sessions
            </h3>
            <div className="space-y-3">
              <CellWrapper className="bg-success/5 border-1 border-success/20">
                <div className="flex items-center gap-3">
                  <Icon icon="solar:laptop-linear" className="text-success" width={20} />
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-small text-default-500">
                      Chrome on Windows • New York, NY
                    </p>
                  </div>
                </div>
                <Chip color="success" variant="flat" size="sm">
                  Active Now
                </Chip>
              </CellWrapper>

              <CellWrapper>
                <div className="flex items-center gap-3">
                  <Icon icon="solar:phone-linear" className="text-default-400" width={20} />
                  <div>
                    <p className="font-medium">Mobile App</p>
                    <p className="text-small text-default-500">
                      iOS App • Last active 2 hours ago
                    </p>
                  </div>
                </div>
                <Button
                  color="danger"
                  variant="light"
                  size="sm"
                  startContent={<Icon icon="solar:logout-2-linear" />}
                >
                  Sign Out
                </Button>
              </CellWrapper>

              <Button
                color="danger"
                variant="bordered"
                size="sm"
                startContent={<Icon icon="solar:logout-3-linear" />}
              >
                Sign Out All Devices
              </Button>
            </div>
          </div>

          <Divider />

          {/* Danger Zone */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-danger">
              <Icon icon="solar:danger-linear" className="text-danger" width={20} />
              Danger Zone
            </h3>
            <div className="space-y-4">
              <CellWrapper className="border-1 border-warning/30 bg-warning/5">
                <div>
                  <p className="font-medium">Deactivate Account</p>
                  <p className="text-small text-default-500">
                    Temporarily deactivate your account. You can reactivate it later.
                  </p>
                </div>
                <Button 
                  color="warning"
                  radius="full" 
                  variant="bordered"
                  size="sm"
                  startContent={<Icon icon="solar:pause-linear" />}
                >
                  Deactivate
                </Button>
              </CellWrapper>

              <CellWrapper className="border-1 border-danger/30 bg-danger/5">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-small text-default-500">
                    Permanently delete your account and all associated data.
                  </p>
                </div>
                <Button 
                  color="danger" 
                  radius="full" 
                  variant="flat"
                  size="sm"
                  onPress={onDeleteModalOpen}
                  startContent={<Icon icon="solar:trash-bin-trash-linear" />}
                >
                  Delete
                </Button>
              </CellWrapper>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Change Password Modal */}
      <Modal isOpen={isPasswordModalOpen} onOpenChange={onPasswordModalOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:lock-password-linear" className="text-primary" width={20} />
                  <span>Change Password</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    type="password"
                    label="Current Password"
                    placeholder="Enter your current password"
                    startContent={<Icon icon="solar:lock-linear" className="text-default-400" />}
                  />
                  <Input
                    type="password"
                    label="New Password"
                    placeholder="Enter your new password"
                    startContent={<Icon icon="solar:lock-password-linear" className="text-default-400" />}
                  />
                  <Input
                    type="password"
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    startContent={<Icon icon="solar:lock-password-linear" className="text-default-400" />}
                  />
                </div>
                <p className="text-small text-default-500">
                  Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  onPress={handleChangePassword}
                >
                  {isLoading ? "Changing..." : "Change Password"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 2FA Setup Modal */}
      <Modal isOpen={is2FAModalOpen} onOpenChange={on2FAModalOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:shield-plus-linear" className="text-primary" width={20} />
                  <span>Enable Two-Factor Authentication</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="text-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 mx-auto">
                    <Icon icon="solar:smartphone-linear" className="text-primary" width={32} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Scan QR Code</h3>
                    <p className="text-small text-default-500">
                      Use your authenticator app to scan this QR code and enter the verification code below.
                    </p>
                  </div>
                  <div className="bg-default-100 p-4 rounded-lg">
                    <div className="w-32 h-32 bg-default-200 rounded-lg mx-auto flex items-center justify-center">
                      <Icon icon="solar:qr-code-linear" width={64} className="text-default-400" />
                    </div>
                  </div>
                  <Input
                    label="Verification Code"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    startContent={<Icon icon="solar:password-linear" className="text-default-400" />}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  onPress={handleSetup2FA}
                >
                  {isLoading ? "Enabling..." : "Enable 2FA"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Account Modal */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:danger-linear" className="text-danger" width={20} />
                  <span>Delete Account</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <p className="text-foreground">
                    Are you sure you want to delete your account? This action cannot be undone.
                  </p>
                  <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
                    <h4 className="font-semibold text-danger mb-2">This will permanently:</h4>
                    <ul className="text-small text-danger space-y-1">
                      <li>• Delete all your contacts and data</li>
                      <li>• Cancel your active subscription</li>
                      <li>• Remove access to all features</li>
                      <li>• Delete your account profile</li>
                    </ul>
                  </div>
                  <Input
                    label="Type 'DELETE' to confirm"
                    placeholder="DELETE"
                    variant="bordered"
                    color="danger"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isLoading}
                  onPress={handleDeleteAccount}
                >
                  {isLoading ? "Deleting..." : "Delete Account"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}