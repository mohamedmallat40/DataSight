"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  Card,
  CardBody,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

import LinkedInScrapeWizard from "./linkedin-scrape-wizard";
import CSVImportWizard from "./csv-import-wizard";
import ManualFormWizard from "./manual-form-wizard";

import MultiStepWizard from "@/pages/table/add-card/multi-step-wizard";

interface UnifiedContactModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSuccess: () => void;
}

type ContactMethod = "selection" | "ocr" | "linkedin" | "csv" | "manual";

const contactMethods = [
  {
    id: "ocr" as ContactMethod,
    title: "Scan Business Card",
    description: "Use OCR to extract data from business card images",
    icon: "solar:camera-linear",
  },
  {
    id: "manual" as ContactMethod,
    title: "Manual Entry",
    description: "Fill out contact information manually",
    icon: "solar:user-plus-linear",
  },
  {
    id: "linkedin" as ContactMethod,
    title: "LinkedIn Profile",
    description: "Import contact data from LinkedIn profile URL",
    icon: "solar:link-linear",
  },
  {
    id: "csv" as ContactMethod,
    title: "Import CSV",
    description: "Bulk import contacts from CSV file",
    icon: "solar:document-linear",
  },
];

export default function UnifiedContactModal({
  isOpen,
  onOpenChange,
  onSuccess,
}: UnifiedContactModalProps) {
  const [currentView, setCurrentView] = useState<ContactMethod>("selection");

  const handleMethodSelect = (method: ContactMethod) => {
    setCurrentView(method);
  };

  const handleBackToSelection = () => {
    setCurrentView("selection");
  };

  const handleWizardSuccess = () => {
    setCurrentView("selection");
    onSuccess();
    onOpenChange();
  };

  const handleModalClose = () => {
    setCurrentView("selection");
    onOpenChange();
  };

  const renderContent = () => {
    switch (currentView) {
      case "selection":
        return (
          <motion.div
            key="selection"
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto p-6"
            exit={{ opacity: 0, scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Add New Contact
              </h2>
              <p className="text-default-600">
                Choose how you'd like to add contacts to your database
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.id}
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    isPressable
                    className="border-1 border-default-200 hover:border-primary hover:shadow-md transition-all duration-200 cursor-pointer group h-full"
                    onPress={() => handleMethodSelect(method.id)}
                  >
                    <CardBody className="p-6 text-center">
                      <div className="w-16 h-16 bg-default-100 dark:bg-default-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors duration-200">
                        <Icon
                          className={`transition-colors duration-200 ${
                            method.id === "ocr"
                              ? "text-blue-600"
                              : method.id === "linkedin"
                                ? "text-purple-600"
                                : method.id === "csv"
                                  ? "text-orange-600"
                                  : method.id === "manual"
                                    ? "text-green-600"
                                    : "text-default-600"
                          }`}
                          icon={method.icon}
                          width={32}
                        />
                      </div>

                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {method.title}
                      </h3>

                      <p className="text-small text-default-500 leading-relaxed mb-4">
                        {method.description}
                      </p>

                      <Button
                        className="w-full font-medium"
                        color="primary"
                        endContent={
                          <Icon icon="solar:arrow-right-linear" width={16} />
                        }
                        size="sm"
                        variant="light"
                      >
                        Select
                      </Button>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button
                size="lg"
                startContent={
                  <Icon icon="solar:close-circle-linear" width={20} />
                }
                variant="light"
                onPress={handleModalClose}
              >
                Cancel
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-default-50 dark:bg-default-100/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon
                  className="text-primary mt-0.5"
                  icon="solar:info-circle-linear"
                  width={20}
                />
                <div className="text-small text-default-600">
                  <p className="font-medium mb-1">Need help choosing?</p>
                  <ul className="space-y-1 text-tiny">
                    <li>
                      • <strong>Business Card Scan:</strong> Best for events and
                      in-person meetings
                    </li>
                    <li>
                      • <strong>LinkedIn Import:</strong> Perfect for networking
                      and sales outreach
                    </li>
                    <li>
                      • <strong>CSV Import:</strong> Ideal for migrating from
                      other systems
                    </li>
                    <li>
                      • <strong>Manual Entry:</strong> When you have specific
                      contact details to add
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "ocr":
        return (
          <motion.div
            key="ocr"
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 p-6 border-b border-default-200">
              <Button
                isIconOnly
                startContent={
                  <Icon icon="solar:arrow-left-linear" width={20} />
                }
                variant="light"
                onPress={handleBackToSelection}
              />
              <div className="flex items-center gap-2">
                <Icon
                  className="text-blue-600"
                  icon="solar:camera-linear"
                  width={20}
                />
                <h2 className="text-lg font-semibold">Business Card Scan</h2>
              </div>
            </div>
            <MultiStepWizard
              onClose={handleBackToSelection}
              onSuccess={handleWizardSuccess}
            />
          </motion.div>
        );

      case "linkedin":
        return (
          <motion.div
            key="linkedin"
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 p-6 border-b border-default-200">
              <Button
                isIconOnly
                startContent={
                  <Icon icon="solar:arrow-left-linear" width={20} />
                }
                variant="light"
                onPress={handleBackToSelection}
              />
              <div className="flex items-center gap-2">
                <Icon
                  className="text-purple-600"
                  icon="solar:link-linear"
                  width={20}
                />
                <h2 className="text-lg font-semibold">LinkedIn Import</h2>
              </div>
            </div>
            <LinkedInScrapeWizard
              onClose={handleBackToSelection}
              onSuccess={handleWizardSuccess}
            />
          </motion.div>
        );

      case "csv":
        return (
          <motion.div
            key="csv"
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 p-6 border-b border-default-200">
              <Button
                isIconOnly
                startContent={
                  <Icon icon="solar:arrow-left-linear" width={20} />
                }
                variant="light"
                onPress={handleBackToSelection}
              />
              <div className="flex items-center gap-2">
                <Icon
                  className="text-orange-600"
                  icon="solar:document-linear"
                  width={20}
                />
                <h2 className="text-lg font-semibold">CSV Import</h2>
              </div>
            </div>
            <CSVImportWizard
              onClose={handleBackToSelection}
              onSuccess={handleWizardSuccess}
            />
          </motion.div>
        );

      case "manual":
        return (
          <motion.div
            key="manual"
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 p-6 border-b border-default-200">
              <Button
                isIconOnly
                startContent={
                  <Icon icon="solar:arrow-left-linear" width={20} />
                }
                variant="light"
                onPress={handleBackToSelection}
              />
              <div className="flex items-center gap-2">
                <Icon
                  className="text-green-600"
                  icon="solar:user-plus-linear"
                  width={20}
                />
                <h2 className="text-lg font-semibold">Manual Entry</h2>
              </div>
            </div>
            <ManualFormWizard
              onClose={handleBackToSelection}
              onSuccess={handleWizardSuccess}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      classNames={{
        base: "max-h-[95vh]",
        body: "p-0",
      }}
      hideCloseButton={false}
      isDismissable={true}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="5xl"
      onOpenChange={handleModalClose}
    >
      <ModalContent className="max-w-[1400px]">
        <ModalBody className="p-0">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
