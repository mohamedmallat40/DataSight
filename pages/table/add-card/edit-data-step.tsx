import React, { useState } from "react";
import {
  Input,
  Textarea,
  Button,
  Image,
  Card,
  CardBody,
  Divider,
  addToast,
  RadioGroup,
  Radio,
  Chip,
  // addToast should come from your toast context/provider or custom hook
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

import { BusinessCardData } from "../../../types/types";

import apiClient from "@/config/api";

export interface EditDataStepProps {
  businessCardData: BusinessCardData;
  setBusinessCardData: (data: BusinessCardData) => void;
  uploadedImage: string | null;
  onNextStep: () => void;
}

const EditDataStep: React.FC<EditDataStepProps> = ({
  businessCardData,
  setBusinessCardData,
  uploadedImage,
  onNextStep,
}) => {
  const [loading, setLoading] = useState(false);
  // Example toast hook

  // Handles all single-value inputs or array fields reset if user types directly
  const handleInputChange = (field: keyof BusinessCardData, value: string) => {
    if (field === "email" || field === "phone_number") {
      // Reset array to single value on direct edit
      setBusinessCardData({
        ...businessCardData,
        [field]: [value],
      });
    } else {
      setBusinessCardData({
        ...businessCardData,
        [field]: value,
      });
    }
  };

  // Handle gender selection
  const handleGenderChange = (value: string) => {
    let genderValue: boolean | null;
    switch (value) {
      case "male":
        genderValue = true;
        break;
      case "female":
        genderValue = false;
        break;
      default:
        genderValue = null;
        break;
    }
    setBusinessCardData({
      ...businessCardData,
      gender: genderValue,
    });
  };

  // Handles change in a specific index of email or phone number arrays
  const handleArrayInputChange = (
    field: "email" | "phone_number",
    index: number,
    value: string,
  ) => {
    const newArray = [...businessCardData[field]];

    newArray[index] = value;
    setBusinessCardData({
      ...businessCardData,
      [field]: newArray,
    });
  };

  // Add empty string to email or phone_number arrays
  const addArrayItem = (field: "email" | "phone_number") => {
    setBusinessCardData({
      ...businessCardData,
      [field]: [...businessCardData[field], ""],
    });
  };

  // Remove item at index from email or phone_number arrays, but keep at least one
  const removeArrayItem = (field: "email" | "phone_number", index: number) => {
    if (businessCardData[field].length <= 1) return;

    const newArray = businessCardData[field].filter((_, i) => i !== index);

    setBusinessCardData({
      ...businessCardData,
      [field]: newArray,
    });
  };

  // Submit updated business card data
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(
        "/update-card-info",
        businessCardData,
      );

      if (response.status === 201) {
        onNextStep();
      } else {
        addToast({
          title: "Unexpected Response",
          description: `Received status ${response.status}`,
          color: "warning",
        });
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      addToast({
        title: "Error",
        description: "Error occurred while saving data",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-3xl font-bold leading-9 text-default-foreground">
        Edit Business Card Data
      </div>
      <div className="py-4 text-base leading-5 text-default-500">
        Review and edit the extracted information from the business card
      </div>

      <div className="grid flex-auto gap-6 py-8">
        {/* Uncomment if you want to show image and raw text */}
        {uploadedImage && (
          <Card className="col-span-12 md:col-span-4 p-4">
            <Image
              alt="Business card"
              className="rounded-medium object-contain w-full max-h-[300px]"
              src={uploadedImage}
            />
            <Divider className="my-4" />
            <Textarea
              className="w-full"
              label="Raw Text"
              labelPlacement="outside"
              minRows={5}
              placeholder="Raw text from business card"
              value={businessCardData.raw_text}
              onChange={(e) => handleInputChange("raw_text", e.target.value)}
            />
          </Card>
        )}

        <div
          className={cn(
            "col-span-12",
            uploadedImage ? "md:col-span-8" : "md:col-span-12",
          )}
        >
          <div className="grid grid-cols-12 gap-4">
            <Input
              className="col-span-12 md:col-span-6"
              label="Full Name"
              labelPlacement="outside"
              placeholder="Full Name"
              startContent={
                <Icon className="text-default-400" icon="lucide:user" />
              }
              value={businessCardData.full_name}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
            />

            <Input
              className="col-span-12 md:col-span-6"
              label="Job Title"
              labelPlacement="outside"
              placeholder="Job Title"
              startContent={
                <Icon className="text-default-400" icon="lucide:briefcase" />
              }
              value={businessCardData.job_title}
              onChange={(e) => handleInputChange("job_title", e.target.value)}
            />

            <Input
              className="col-span-12"
              label="Company Name"
              labelPlacement="outside"
              placeholder="Company Name"
              startContent={
                <Icon className="text-default-400" icon="lucide:building" />
              }
              value={businessCardData.company_name}
              onChange={(e) =>
                handleInputChange("company_name", e.target.value)
              }
            />

            <div className="col-span-12">
              <div className="flex items-center justify-between mb-2">
                <label className="text-small font-medium text-default-700">
                  Email Addresses
                </label>
                <Button
                  color="secondary"
                  size="sm"
                  startContent={<Icon icon="lucide:plus" width={16} />}
                  variant="light"
                  onPress={() => addArrayItem("email")}
                >
                  Add Email
                </Button>
              </div>

              {businessCardData.email.map((email, index) => (
                <div
                  key={`email-${index}`}
                  className="flex items-center gap-2 mb-2"
                >
                  <Input
                    className="flex-1"
                    placeholder="Email Address"
                    startContent={
                      <Icon className="text-default-400" icon="lucide:mail" />
                    }
                    value={email}
                    onChange={(e) =>
                      handleArrayInputChange("email", index, e.target.value)
                    }
                  />
                  {businessCardData.email.length > 1 && (
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => removeArrayItem("email", index)}
                    >
                      <Icon icon="lucide:trash-2" width={18} />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="col-span-12">
              <div className="flex items-center justify-between mb-2">
                <label className="text-small font-medium text-default-700">
                  Phone Numbers
                </label>
                <Button
                  color="secondary"
                  size="sm"
                  startContent={<Icon icon="lucide:plus" width={16} />}
                  variant="light"
                  onPress={() => addArrayItem("phone_number")}
                >
                  Add Phone
                </Button>
              </div>

              {businessCardData.phone_number.map((phone, index) => (
                <div
                  key={`phone-${index}`}
                  className="flex items-center gap-2 mb-2"
                >
                  <Input
                    className="flex-1"
                    placeholder="Phone Number"
                    startContent={
                      <Icon className="text-default-400" icon="lucide:phone" />
                    }
                    value={phone}
                    onChange={(e) =>
                      handleArrayInputChange(
                        "phone_number",
                        index,
                        e.target.value,
                      )
                    }
                  />
                  {businessCardData.phone_number.length > 1 && (
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => removeArrayItem("phone_number", index)}
                    >
                      <Icon icon="lucide:trash-2" width={18} />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Input
              className="col-span-12 md:col-span-6"
              label="Website"
              labelPlacement="outside"
              placeholder="Website"
              startContent={
                <Icon className="text-default-400" icon="lucide:globe" />
              }
              value={businessCardData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />

            <Input
              className="col-span-12 md:col-span-6"
              label="LinkedIn"
              labelPlacement="outside"
              placeholder="LinkedIn Profile"
              startContent={
                <Icon className="text-default-400" icon="lucide:linkedin" />
              }
              value={businessCardData.linkedin}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
            />

            <Input
              className="col-span-12"
              label="Address"
              labelPlacement="outside"
              placeholder="Address"
              startContent={
                <Icon className="text-default-400" icon="lucide:map-pin" />
              }
              value={businessCardData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />

            <Input
              className="col-span-12 md:col-span-6"
              label="City"
              labelPlacement="outside"
              placeholder="City"
              startContent={
                <Icon className="text-default-400" icon="lucide:building-2" />
              }
              value={businessCardData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />

            <Input
              className="col-span-12 md:col-span-6"
              label="Country"
              labelPlacement="outside"
              placeholder="Country"
              startContent={
                <Icon className="text-default-400" icon="lucide:flag" />
              }
              value={businessCardData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
            />

            <div className="col-span-12">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-small font-medium text-default-700">
                    Gender
                  </label>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={
                      businessCardData.gender === true
                        ? "primary"
                        : businessCardData.gender === false
                          ? "secondary"
                          : "default"
                    }
                    startContent={
                      <Icon
                        icon={
                          businessCardData.gender === true
                            ? "lucide:male"
                            : businessCardData.gender === false
                              ? "lucide:female"
                              : "lucide:help-circle"
                        }
                        width={12}
                      />
                    }
                  >
                    {businessCardData.gender === true
                      ? "Male"
                      : businessCardData.gender === false
                        ? "Female"
                        : "Not Specified"}
                  </Chip>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Male Option */}
                  <Card
                    isPressable
                    isHoverable
                    className={cn(
                      "border-2 transition-all duration-200 cursor-pointer",
                      businessCardData.gender === true
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-default-200 hover:border-blue-300",
                    )}
                    onPress={() => handleGenderChange("male")}
                  >
                    <CardBody className="p-4">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div
                          className={cn(
                            "p-3 rounded-full transition-colors",
                            businessCardData.gender === true
                              ? "bg-blue-500 text-white"
                              : "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
                          )}
                        >
                          <Icon icon="lucide:male" width={24} height={24} />
                        </div>
                        <div>
                          <h4
                            className={cn(
                              "font-semibold text-sm",
                              businessCardData.gender === true
                                ? "text-blue-700 dark:text-blue-300"
                                : "text-default-700",
                            )}
                          >
                            Male
                          </h4>
                          <p className="text-xs text-default-500">
                            Masculine identity
                          </p>
                        </div>
                        {businessCardData.gender === true && (
                          <Icon
                            icon="lucide:check-circle"
                            className="text-blue-500"
                            width={16}
                          />
                        )}
                      </div>
                    </CardBody>
                  </Card>

                  {/* Female Option */}
                  <Card
                    isPressable
                    isHoverable
                    className={cn(
                      "border-2 transition-all duration-200 cursor-pointer",
                      businessCardData.gender === false
                        ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                        : "border-default-200 hover:border-pink-300",
                    )}
                    onPress={() => handleGenderChange("female")}
                  >
                    <CardBody className="p-4">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div
                          className={cn(
                            "p-3 rounded-full transition-colors",
                            businessCardData.gender === false
                              ? "bg-pink-500 text-white"
                              : "bg-pink-100 text-pink-600 dark:bg-pink-900/30",
                          )}
                        >
                          <Icon icon="lucide:female" width={24} height={24} />
                        </div>
                        <div>
                          <h4
                            className={cn(
                              "font-semibold text-sm",
                              businessCardData.gender === false
                                ? "text-pink-700 dark:text-pink-300"
                                : "text-default-700",
                            )}
                          >
                            Female
                          </h4>
                          <p className="text-xs text-default-500">
                            Feminine identity
                          </p>
                        </div>
                        {businessCardData.gender === false && (
                          <Icon
                            icon="lucide:check-circle"
                            className="text-pink-500"
                            width={16}
                          />
                        )}
                      </div>
                    </CardBody>
                  </Card>

                  {/* Unknown Option */}
                  <Card
                    isPressable
                    isHoverable
                    className={cn(
                      "border-2 transition-all duration-200 cursor-pointer",
                      businessCardData.gender === null
                        ? "border-default-400 bg-default-100 dark:bg-default-100/20"
                        : "border-default-200 hover:border-default-300",
                    )}
                    onPress={() => handleGenderChange("unknown")}
                  >
                    <CardBody className="p-4">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div
                          className={cn(
                            "p-3 rounded-full transition-colors",
                            businessCardData.gender === null
                              ? "bg-default-500 text-white"
                              : "bg-default-200 text-default-600",
                          )}
                        >
                          <Icon
                            icon="lucide:help-circle"
                            width={24}
                            height={24}
                          />
                        </div>
                        <div>
                          <h4
                            className={cn(
                              "font-semibold text-sm",
                              businessCardData.gender === null
                                ? "text-default-700 dark:text-default-300"
                                : "text-default-700",
                            )}
                          >
                            Not Specified
                          </h4>
                          <p className="text-xs text-default-500">
                            Prefer not to say
                          </p>
                        </div>
                        {businessCardData.gender === null && (
                          <Icon
                            icon="lucide:check-circle"
                            className="text-default-500"
                            width={16}
                          />
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </div>

                {/* Additional Context */}
                <div className="flex items-center gap-2 text-xs text-default-500 mt-1">
                  <Icon icon="lucide:info" width={12} />
                  <span>
                    This information helps with personalized communication and
                    analytics
                  </span>
                </div>
              </div>
            </div>

            <Textarea
              className="col-span-12"
              label="Notes"
              labelPlacement="outside"
              placeholder="Add any additional notes or comments about this contact..."
              minRows={3}
              maxRows={6}
              startContent={
                <Icon className="text-default-400" icon="lucide:sticky-note" />
              }
              value={businessCardData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button
          color="primary"
          isLoading={loading}
          startContent={<Icon icon="lucide:save" />}
          onPress={handleSubmit}
        >
          Save & Continue
        </Button>
      </div>
    </>
  );
};

export default EditDataStep;
