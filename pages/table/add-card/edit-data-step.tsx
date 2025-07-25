import React, { useState, useEffect, useCallback } from "react";
import {
  Input,
  Textarea,
  Button,
  Image,
  Card,
  CardBody,
  Divider,
  addToast,
  Chip,
  Select,
  SelectItem,
  // addToast should come from your toast context/provider or custom hook
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

import { BusinessCardData } from "../../../types/types";

import apiClient from "@/config/api";

interface Pool {
  id: number;
  label: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

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
  const [pools, setPools] = useState<Pool[]>([]);
  // Example toast hook

  useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = useCallback(async (): Promise<void> => {
    try {
      const response = await apiClient.get<ApiResponse<Pool[]>>("/get-pools");
      const { data } = response;

      if (data?.success && Array.isArray(data?.data)) {
        setPools(data.data);
      } else {
        setPools([]);
        console.warn("API response does not contain valid pools data");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      console.error("Error fetching pools:", errorMessage);
      setPools([]);
    }
  }, []);

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
    // Validate required fields
    if (!businessCardData.pool_id) {
      addToast({
        title: "Validation Error",
        description: "Please select a pool before saving",
        color: "danger",
      });

      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(
        "/update-card-info",
        businessCardData,
      );

      if (response.status === 201) {
        addToast({
          title: "Success!",
          description: "Contact information has been saved successfully",
          color: "success",
        });
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

            <Select
              isRequired
              className="col-span-12"
              errorMessage={
                !businessCardData.pool_id ? "Please select a pool" : ""
              }
              isInvalid={!businessCardData.pool_id}
              label="Pool"
              labelPlacement="outside"
              placeholder="Select a pool"
              selectedKeys={
                businessCardData.pool_id ? [businessCardData.pool_id] : []
              }
              startContent={
                <Icon className="text-default-400" icon="lucide:layers" />
              }
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;

                setBusinessCardData({
                  ...businessCardData,
                  pool_id: selectedKey || null,
                });
              }}
            >
              {pools.map((pool) => (
                <SelectItem key={pool.id.toString()} value={pool.id.toString()}>
                  {pool.label}
                </SelectItem>
              ))}
            </Select>

            <div className="col-span-12">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    <Icon
                      className="text-default-400"
                      icon="solar:user-id-linear"
                      width={20}
                    />
                    <label className="text-base font-semibold text-default-700">
                      Gender Identification
                    </label>
                    {businessCardData.gender !== null && (
                      <Chip
                        className="ml-2"
                        color={
                          businessCardData.gender === true
                            ? "primary"
                            : "secondary"
                        }
                        size="md"
                        startContent={
                          <Icon
                            icon={
                              businessCardData.gender === true
                                ? "solar:men-linear"
                                : "solar:women-linear"
                            }
                            width={14}
                          />
                        }
                        variant="shadow"
                      >
                        {businessCardData.gender === true ? "Male" : "Female"}
                      </Chip>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-8 px-4">
                  {/* Male Option - Left Side */}
                  <div className="flex-1 max-w-xs">
                    <Card
                      isHoverable
                      isPressable
                      className={cn(
                        "border-2 transition-all duration-300 cursor-pointer transform hover:scale-105",
                        businessCardData.gender === true
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 shadow-lg shadow-blue-200/50"
                          : "border-default-200 hover:border-blue-300 hover:bg-blue-50/30",
                      )}
                      onPress={() => handleGenderChange("male")}
                    >
                      <CardBody className="p-6">
                        <div className="flex flex-col items-center gap-4 text-center">
                          {/* Creative Male Icon */}
                          <div className="relative">
                            <div
                              className={cn(
                                "p-4 rounded-full transition-all duration-300",
                                businessCardData.gender === true
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-300/40"
                                  : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600 dark:from-blue-900/40 dark:to-blue-800/30",
                              )}
                            >
                              <Icon
                                height={32}
                                icon="solar:men-bold"
                                width={32}
                              />
                            </div>
                            {businessCardData.gender === true && (
                              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                                <Icon
                                  icon="solar:check-circle-bold"
                                  width={16}
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <h4
                              className={cn(
                                "font-bold text-lg",
                                businessCardData.gender === true
                                  ? "text-blue-700 dark:text-blue-300"
                                  : "text-default-700",
                              )}
                            >
                              Male
                            </h4>
                            <div className="flex items-center justify-center gap-2">
                              <Icon
                                className="text-blue-500"
                                icon="solar:user-bold"
                                width={14}
                              />
                              <p className="text-sm text-default-600">
                                Masculine
                              </p>
                            </div>
                          </div>

                          {businessCardData.gender === true && (
                            <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                              <Icon icon="solar:star-bold" width={12} />
                              Selected
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* VS Separator */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-px h-16 bg-gradient-to-b from-transparent via-default-300 to-transparent" />
                    <div className="bg-default-100 rounded-full p-2">
                      <Icon
                        className="text-default-400"
                        icon="solar:layers-minimalistic-linear"
                        width={16}
                      />
                    </div>
                    <div className="w-px h-16 bg-gradient-to-b from-transparent via-default-300 to-transparent" />
                  </div>

                  {/* Female Option - Right Side */}
                  <div className="flex-1 max-w-xs">
                    <Card
                      isHoverable
                      isPressable
                      className={cn(
                        "border-2 transition-all duration-300 cursor-pointer transform hover:scale-105",
                        businessCardData.gender === false
                          ? "border-pink-500 bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/30 dark:to-rose-800/20 shadow-lg shadow-pink-200/50"
                          : "border-default-200 hover:border-pink-300 hover:bg-pink-50/30",
                      )}
                      onPress={() => handleGenderChange("female")}
                    >
                      <CardBody className="p-6">
                        <div className="flex flex-col items-center gap-4 text-center">
                          {/* Creative Female Icon */}
                          <div className="relative">
                            <div
                              className={cn(
                                "p-4 rounded-full transition-all duration-300",
                                businessCardData.gender === false
                                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-300/40"
                                  : "bg-gradient-to-r from-pink-100 to-rose-200 text-pink-600 dark:from-pink-900/40 dark:to-rose-800/30",
                              )}
                            >
                              <Icon
                                height={32}
                                icon="solar:women-bold"
                                width={32}
                              />
                            </div>
                            {businessCardData.gender === false && (
                              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                                <Icon
                                  icon="solar:check-circle-bold"
                                  width={16}
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <h4
                              className={cn(
                                "font-bold text-lg",
                                businessCardData.gender === false
                                  ? "text-pink-700 dark:text-pink-300"
                                  : "text-default-700",
                              )}
                            >
                              Female
                            </h4>
                            <div className="flex items-center justify-center gap-2">
                              <Icon
                                className="text-pink-500"
                                icon="solar:user-bold"
                                width={14}
                              />
                              <p className="text-sm text-default-600">
                                Feminine
                              </p>
                            </div>
                          </div>

                          {businessCardData.gender === false && (
                            <div className="flex items-center gap-1 text-xs text-pink-600 font-medium">
                              <Icon icon="solar:star-bold" width={12} />
                              Selected
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>

                {/* Clear Selection Option */}
                {businessCardData.gender !== null && (
                  <div className="flex justify-center">
                    <Button
                      className="hover:bg-default-100"
                      color="default"
                      size="sm"
                      startContent={
                        <Icon icon="solar:restart-linear" width={16} />
                      }
                      variant="bordered"
                      onPress={() => handleGenderChange("unknown")}
                    >
                      Reset Selection
                    </Button>
                  </div>
                )}

                {/* Additional Context */}
                <div className="flex items-center justify-center gap-2 text-xs text-default-500 bg-default-50 rounded-lg p-3">
                  <Icon icon="solar:info-circle-linear" width={16} />
                  <span>
                    This helps us provide personalized communication and better
                    analytics insights
                  </span>
                </div>
              </div>
            </div>
            <Textarea
              className="col-span-12"
              label="Notes"
              labelPlacement="outside"
              maxRows={6}
              minRows={3}
              placeholder="Add any additional notes or comments about this contact..."
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
          isDisabled={!businessCardData.pool_id || loading}
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
