"use client";

import React from "react";
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import MultiStepWizard from "@/pages/table/add-card/multi-step-wizard";
import LinkedInScrapeWizard from "./linkedin-scrape-wizard";
import CSVImportWizard from "./csv-import-wizard";
import ManualFormWizard from "./manual-form-wizard";

interface ContactMethodSelectorProps {
  onClose: () => void;
  onSuccess: () => void;
}

type ContactMethod = 'ocr' | 'linkedin' | 'csv' | 'manual';

const contactMethods = [
  {
    id: 'ocr' as ContactMethod,
    title: 'Scan Business Card',
    description: 'Use OCR to extract data from business card images',
    icon: 'solar:camera-linear',
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    iconColor: 'text-blue-600',
    popular: true,
  },
  {
    id: 'manual' as ContactMethod,
    title: 'Manual Entry',
    description: 'Fill out contact information manually',
    icon: 'solar:user-plus-linear',
    gradient: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    iconColor: 'text-green-600',
  },
  {
    id: 'linkedin' as ContactMethod,
    title: 'LinkedIn Profile',
    description: 'Import contact data from LinkedIn profile URL',
    icon: 'solar:link-linear',
    gradient: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    iconColor: 'text-purple-600',
    new: true,
  },
  {
    id: 'csv' as ContactMethod,
    title: 'Import CSV',
    description: 'Bulk import contacts from CSV file',
    icon: 'solar:document-linear',
    gradient: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    iconColor: 'text-orange-600',
  },
];

export default function ContactMethodSelector({ onClose, onSuccess }: ContactMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = React.useState<ContactMethod | null>(null);
  const { isOpen: isWizardOpen, onOpen: onWizardOpen, onOpenChange: onWizardOpenChange } = useDisclosure();

  const handleMethodSelect = (method: ContactMethod) => {
    setSelectedMethod(method);
    onWizardOpen();
  };

  const handleWizardClose = () => {
    onWizardOpenChange();
    setSelectedMethod(null);
  };

  const handleWizardSuccess = () => {
    handleWizardClose();
    onSuccess();
    onClose();
  };

  const renderWizard = () => {
    switch (selectedMethod) {
      case 'ocr':
        return <MultiStepWizard onClose={handleWizardClose} onSuccess={handleWizardSuccess} />;
      case 'linkedin':
        return <LinkedInScrapeWizard onClose={handleWizardClose} onSuccess={handleWizardSuccess} />;
      case 'csv':
        return <CSVImportWizard onClose={handleWizardClose} onSuccess={handleWizardSuccess} />;
      case 'manual':
        return <ManualFormWizard onClose={handleWizardClose} onSuccess={handleWizardSuccess} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Add New Contact</h2>
          <p className="text-default-600">
            Choose how you'd like to add contacts to your database
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`${method.bgColor} border-1 border-transparent hover:border-primary/30 transition-all duration-200 cursor-pointer group h-full`}
                isPressable
                onPress={() => handleMethodSelect(method.id)}
              >
                <CardBody className="p-6 text-center relative">
                  {method.popular && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-primary text-white text-tiny px-2 py-1 rounded-full font-medium">
                        Popular
                      </div>
                    </div>
                  )}
                  {method.new && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-success text-white text-tiny px-2 py-1 rounded-full font-medium">
                        New
                      </div>
                    </div>
                  )}
                  
                  <div className={`w-16 h-16 ${method.iconColor} bg-white dark:bg-default-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon icon={method.icon} width={32} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {method.title}
                  </h3>
                  
                  <p className="text-small text-default-500 leading-relaxed">
                    {method.description}
                  </p>

                  <div className="mt-4">
                    <Button
                      className={`bg-gradient-to-r ${method.gradient} text-white font-medium w-full group-hover:shadow-lg transition-shadow duration-200`}
                      size="sm"
                      startContent={<Icon icon="solar:arrow-right-linear" width={16} />}
                    >
                      Get Started
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="light"
            size="lg"
            startContent={<Icon icon="solar:close-circle-linear" width={20} />}
            onPress={onClose}
          >
            Cancel
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-default-50 dark:bg-default-100/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon icon="solar:info-circle-linear" className="text-primary mt-0.5" width={20} />
            <div className="text-small text-default-600">
              <p className="font-medium mb-1">Need help choosing?</p>
              <ul className="space-y-1 text-tiny">
                <li>• <strong>Business Card Scan:</strong> Best for events and in-person meetings</li>
                <li>• <strong>LinkedIn Import:</strong> Perfect for networking and sales outreach</li>
                <li>• <strong>CSV Import:</strong> Ideal for migrating from other systems</li>
                <li>• <strong>Manual Entry:</strong> When you have specific contact details to add</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Wizard Modal */}
      <Modal
        isOpen={isWizardOpen}
        onOpenChange={onWizardOpenChange}
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh]",
          body: "p-0",
        }}
      >
        <ModalContent>
          <ModalBody className="p-0">
            {renderWizard()}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}