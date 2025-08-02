"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Divider,
  Chip,
  Avatar,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { Users } from "@/types/data";
import countries from "@/components/profile/countries";

interface ManualFormWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ManualFormWizard({
  onClose,
  onSuccess,
}: ManualFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Users>>({
    source: "Manual Entry",
    date_collected: new Date().toISOString().split("T")[0],
  });

  const steps = [
    { id: 1, title: "Basic Information", icon: "solar:user-linear" },
    { id: 2, title: "Contact Details", icon: "solar:phone-linear" },
    { id: 3, title: "Additional Info", icon: "solar:info-circle-linear" },
  ];

  const updateFormData = (field: keyof Users, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Saving manual contact:", formData);

    setIsLoading(false);
    onSuccess();
  };

  const isStep1Valid = () => {
    return formData.full_name && formData.full_name.trim().length > 0;
  };

  const isStep2Valid = () => {
    return (
      (formData.email &&
        Array.isArray(formData.email) &&
        formData.email.length > 0) ||
      (formData.phone_number &&
        Array.isArray(formData.phone_number) &&
        formData.phone_number.length > 0)
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    currentStep >= step.id
                      ? "bg-primary border-primary text-white shadow-lg"
                      : currentStep === step.id - 1
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-default-50 border-default-200 text-default-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Icon icon="solar:check-circle-bold" width={20} />
                  ) : (
                    <span className="text-medium font-semibold">{step.id}</span>
                  )}
                </div>
                <span
                  className={`text-small font-medium text-center max-w-[80px] ${
                    currentStep >= step.id
                      ? "text-foreground"
                      : "text-default-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-16 mx-4 mt-[-20px] transition-colors duration-200 ${
                    currentStep > step.id ? "bg-primary" : "bg-default-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        initial={{ opacity: 0, x: 20 }}
      >
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon
                  className="text-primary"
                  icon="solar:user-linear"
                  width={20}
                />
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  isRequired
                  label="Full Name"
                  placeholder="Enter full name"
                  startContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:user-linear"
                    />
                  }
                  value={formData.full_name || ""}
                  onValueChange={(value) => updateFormData("full_name", value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="First Name"
                    placeholder="First name"
                    value={formData.first_name || ""}
                    onValueChange={(value) =>
                      updateFormData("first_name", value)
                    }
                  />
                  <Input
                    label="Last Name"
                    placeholder="Last name"
                    value={formData.last_name || ""}
                    onValueChange={(value) =>
                      updateFormData("last_name", value)
                    }
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Job Title"
                  placeholder="Enter job title"
                  startContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:case-linear"
                    />
                  }
                  value={formData.job_title || ""}
                  onValueChange={(value) => updateFormData("job_title", value)}
                />
                <Input
                  label="Company Name"
                  placeholder="Enter company name"
                  startContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:buildings-3-linear"
                    />
                  }
                  value={formData.company_name || ""}
                  onValueChange={(value) =>
                    updateFormData("company_name", value)
                  }
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Industry"
                  placeholder="Enter industry"
                  startContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:briefcase-linear"
                    />
                  }
                  value={formData.industry || ""}
                  onValueChange={(value) => updateFormData("industry", value)}
                />
                <Select
                  label="Gender"
                  placeholder="Select gender"
                  selectedKeys={
                    formData.gender !== null && formData.gender !== undefined
                      ? [formData.gender.toString()]
                      : []
                  }
                  startContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:users-group-rounded-linear"
                    />
                  }
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;

                    updateFormData(
                      "gender",
                      value === "true"
                        ? true
                        : value === "false"
                          ? false
                          : null,
                    );
                  }}
                >
                  <SelectItem key="true" value="true">
                    Male
                  </SelectItem>
                  <SelectItem key="false" value="false">
                    Female
                  </SelectItem>
                  <SelectItem key="null" value="null">
                    Prefer not to say
                  </SelectItem>
                </Select>
              </div>

              <div className="flex justify-between">
                <Button
                  startContent={<Icon icon="solar:close-circle-linear" />}
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isDisabled={!isStep1Valid()}
                  startContent={<Icon icon="solar:arrow-right-linear" />}
                  onPress={handleNextStep}
                >
                  Next: Contact Details
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon
                  className="text-primary"
                  icon="solar:phone-linear"
                  width={20}
                />
                <h3 className="text-lg font-semibold">Contact Details</h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Email Addresses</h4>
                  <div className="space-y-2">
                    <Input
                      label="Primary Email"
                      placeholder="Enter primary email"
                      startContent={
                        <Icon
                          className="text-default-400"
                          icon="solar:letter-linear"
                        />
                      }
                      type="email"
                      value={
                        Array.isArray(formData.email)
                          ? formData.email[0] || ""
                          : ""
                      }
                      onValueChange={(value) => {
                        const emails = Array.isArray(formData.email)
                          ? [...formData.email]
                          : [];

                        emails[0] = value;
                        updateFormData(
                          "email",
                          emails.filter((e) => e),
                        );
                      }}
                    />
                    <Input
                      label="Secondary Email (Optional)"
                      placeholder="Enter secondary email"
                      startContent={
                        <Icon
                          className="text-default-400"
                          icon="solar:letter-linear"
                        />
                      }
                      type="email"
                      value={
                        Array.isArray(formData.email)
                          ? formData.email[1] || ""
                          : ""
                      }
                      onValueChange={(value) => {
                        const emails = Array.isArray(formData.email)
                          ? [...formData.email]
                          : [""];

                        emails[1] = value;
                        updateFormData(
                          "email",
                          emails.filter((e) => e),
                        );
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Phone Numbers</h4>
                  <div className="space-y-2">
                    <Input
                      label="Primary Phone"
                      placeholder="Enter primary phone number"
                      startContent={
                        <Icon
                          className="text-default-400"
                          icon="solar:phone-linear"
                        />
                      }
                      type="tel"
                      value={
                        Array.isArray(formData.phone_number)
                          ? formData.phone_number[0] || ""
                          : ""
                      }
                      onValueChange={(value) => {
                        const phones = Array.isArray(formData.phone_number)
                          ? [...formData.phone_number]
                          : [];

                        phones[0] = value;
                        updateFormData(
                          "phone_number",
                          phones.filter((p) => p),
                        );
                      }}
                    />
                    <Input
                      label="Secondary Phone (Optional)"
                      placeholder="Enter secondary phone number"
                      startContent={
                        <Icon
                          className="text-default-400"
                          icon="solar:phone-linear"
                        />
                      }
                      type="tel"
                      value={
                        Array.isArray(formData.phone_number)
                          ? formData.phone_number[1] || ""
                          : ""
                      }
                      onValueChange={(value) => {
                        const phones = Array.isArray(formData.phone_number)
                          ? [...formData.phone_number]
                          : [""];

                        phones[1] = value;
                        updateFormData(
                          "phone_number",
                          phones.filter((p) => p),
                        );
                      }}
                    />
                  </div>
                </div>
              </div>

              <Divider />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Website"
                  placeholder="Enter website URL"
                  startContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:global-linear"
                    />
                  }
                  value={formData.website || ""}
                  onValueChange={(value) => updateFormData("website", value)}
                />
                <Input
                  label="LinkedIn Profile"
                  placeholder="Enter LinkedIn URL"
                  startContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:link-linear"
                    />
                  }
                  value={formData.linkedin || ""}
                  onValueChange={(value) => updateFormData("linkedin", value)}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  startContent={<Icon icon="solar:arrow-left-linear" />}
                  variant="light"
                  onPress={handlePrevStep}
                >
                  Back
                </Button>
                <Button
                  color="primary"
                  isDisabled={!isStep2Valid()}
                  startContent={<Icon icon="solar:arrow-right-linear" />}
                  onPress={handleNextStep}
                >
                  Next: Additional Info
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon
                  className="text-primary"
                  icon="solar:info-circle-linear"
                  width={20}
                />
                <h3 className="text-lg font-semibold">
                  Additional Information
                </h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Country"
                  placeholder="Select country"
                  selectedKeys={formData.country ? [formData.country] : []}
                  startContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:global-linear"
                    />
                  }
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;

                    updateFormData("country", value);
                    // Also set country code
                    const country = countries.find((c) => c.name === value);

                    if (country) {
                      updateFormData("country_code", country.code);
                    }
                  }}
                >
                  {countries.map((country) => (
                    <SelectItem
                      key={country.name}
                      startContent={
                        <Avatar
                          alt="Country Flag"
                          className="h-6 w-6"
                          src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                        />
                      }
                      value={country.name}
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="City"
                  placeholder="Enter city"
                  startContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:buildings-linear"
                    />
                  }
                  value={formData.city || ""}
                  onValueChange={(value) => updateFormData("city", value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="State/Province"
                  placeholder="Enter state or province"
                  startContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:map-point-linear"
                    />
                  }
                  value={formData.state || ""}
                  onValueChange={(value) => updateFormData("state", value)}
                />
                <Input
                  label="Postal Code"
                  placeholder="Enter postal code"
                  startContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:letter-linear"
                    />
                  }
                  value={formData.postal_code || ""}
                  onValueChange={(value) =>
                    updateFormData("postal_code", value)
                  }
                />
              </div>

              <Input
                label="Address"
                placeholder="Enter full address"
                startContent={
                  <Icon
                    className="text-default-400"
                    icon="solar:map-point-linear"
                  />
                }
                value={formData.address || ""}
                onValueChange={(value) => updateFormData("address", value)}
              />

              <Textarea
                label="Notes"
                minRows={3}
                placeholder="Add any additional notes about this contact..."
                value={formData.notes || ""}
                onValueChange={(value) => updateFormData("notes", value)}
              />

              <Divider />

              {/* Contact Preview */}
              <div>
                <h4 className="font-semibold mb-3">Contact Preview</h4>
                <Card className="bg-default-50 dark:bg-default-100/50">
                  <CardBody className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar
                        showFallback
                        className="w-12 h-12"
                        fallback={<Icon icon="solar:user-linear" width={20} />}
                      />
                      <div className="flex-1">
                        <h5 className="font-semibold text-foreground">
                          {formData.full_name || "No name provided"}
                        </h5>
                        <p className="text-small text-default-600">
                          {formData.job_title || "No job title"}
                          {formData.company_name &&
                            ` at ${formData.company_name}`}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Array.isArray(formData.email) &&
                            formData.email[0] && (
                              <Chip
                                size="sm"
                                startContent={
                                  <Icon icon="solar:letter-linear" width={12} />
                                }
                                variant="flat"
                              >
                                {formData.email[0]}
                              </Chip>
                            )}
                          {Array.isArray(formData.phone_number) &&
                            formData.phone_number[0] && (
                              <Chip
                                size="sm"
                                startContent={
                                  <Icon icon="solar:phone-linear" width={12} />
                                }
                                variant="flat"
                              >
                                {formData.phone_number[0]}
                              </Chip>
                            )}
                          {formData.country && (
                            <Chip
                              size="sm"
                              startContent={
                                <Icon icon="solar:global-linear" width={12} />
                              }
                              variant="flat"
                            >
                              {formData.country}
                            </Chip>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              <div className="flex justify-between">
                <Button
                  startContent={<Icon icon="solar:arrow-left-linear" />}
                  variant="light"
                  onPress={handlePrevStep}
                >
                  Back
                </Button>
                <Button
                  color="success"
                  isLoading={isLoading}
                  startContent={
                    !isLoading ? (
                      <Icon icon="solar:diskette-linear" />
                    ) : undefined
                  }
                  onPress={handleSave}
                >
                  {isLoading ? "Saving..." : "Save Contact"}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
