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
  ButtonGroup,
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
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  // Example toast hook

  useEffect(() => {
    fetchPools();
  }, []);

  useEffect(() => {
    // Set first pool as default if no pool is selected and pools are available
    if (pools.length > 0 && !businessCardData.pool_id) {
      setBusinessCardData({
        ...businessCardData,
        pool_id: pools[0].id.toString(),
      });
    }
  }, [pools, businessCardData.pool_id]);

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

  // Handle tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
        { ...businessCardData, tags },
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
              labelPlacement="inside"
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
          <div className="grid grid-cols-12 gap-6">
            <Input
              className="col-span-12 md:col-span-6"
              label="Full Name"
              labelPlacement="outside-top"
              placeholder="Enter full name"
              startContent={
                <Icon className="text-default-400" icon="lucide:user" />
              }
              value={businessCardData.full_name}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
            />

            <Input
              className="col-span-12 md:col-span-6"
              label="Job Title"
              labelPlacement="outside-top"
              placeholder="Enter job title"
              startContent={
                <Icon className="text-default-400" icon="lucide:briefcase" />
              }
              value={businessCardData.job_title}
              onChange={(e) => handleInputChange("job_title", e.target.value)}
            />

            <Input
              className="col-span-12"
              label="Company Name"
              labelPlacement="outside-top"
              placeholder="Enter company name"
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
                  color="primary"
                  size="sm"
                  startContent={<Icon icon="lucide:plus" width={16} />}
                  variant="bordered"
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
                    placeholder="Enter email address"
                    type="email"
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
                  color="primary"
                  size="sm"
                  startContent={<Icon icon="lucide:plus" width={16} />}
                  variant="bordered"
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
                    placeholder="Enter phone number"
                    type="tel"
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
              labelPlacement="inside"
              placeholder="Enter website URL"
              type="url"
              startContent={
                <Icon className="text-default-400" icon="lucide:globe" />
              }
              value={businessCardData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />

            <Input
              className="col-span-12 md:col-span-6"
              label="LinkedIn"
              labelPlacement="inside"
              placeholder="Enter LinkedIn profile"
              type="url"
              startContent={
                <Icon className="text-default-400" icon="lucide:linkedin" />
              }
              value={businessCardData.linkedin}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
            />

            <Input
              className="col-span-12"
              label="Address"
              labelPlacement="inside"
              placeholder="Enter full address"
              startContent={
                <Icon className="text-default-400" icon="lucide:map-pin" />
              }
              value={businessCardData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />

            <Input
              className="col-span-12 md:col-span-6"
              label="City"
              labelPlacement="inside"
              placeholder="Enter city"
              startContent={
                <Icon className="text-default-400" icon="lucide:building-2" />
              }
              value={businessCardData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />

            <Input
              className="col-span-12 md:col-span-6"
              label="Country"
              labelPlacement="inside"
              placeholder="Enter country"
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
              labelPlacement="inside"
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

            {/* Gender Selection - Compact */}
            <div className="col-span-12 md:col-span-6">
              <label className="text-small font-medium text-default-700 mb-2 block">
                Gender
              </label>
              <ButtonGroup variant="bordered" className="w-full">
                <Button
                  className={cn(
                    "flex-1",
                    businessCardData.gender === true
                      ? "bg-primary/10 border-primary text-primary"
                      : "hover:bg-default-100"
                  )}
                  startContent={
                    <Icon
                      icon="solar:men-bold"
                      width={18}
                      className={businessCardData.gender === true ? "text-primary" : "text-default-500"}
                    />
                  }
                  onPress={() => handleGenderChange("male")}
                >
                  {businessCardData.gender === true && (
                    <Icon icon="lucide:check" width={16} className="ml-1" />
                  )}
                </Button>
                <Button
                  className={cn(
                    "flex-1",
                    businessCardData.gender === false
                      ? "bg-secondary/10 border-secondary text-secondary"
                      : "hover:bg-default-100"
                  )}
                  startContent={
                    <Icon
                      icon="solar:women-bold"
                      width={18}
                      className={businessCardData.gender === false ? "text-secondary" : "text-default-500"}
                    />
                  }
                  onPress={() => handleGenderChange("female")}
                >
                  {businessCardData.gender === false && (
                    <Icon icon="lucide:check" width={16} className="ml-1" />
                  )}
                </Button>
                {businessCardData.gender !== null && (
                  <Button
                    className="px-3"
                    variant="light"
                    isIconOnly
                    onPress={() => handleGenderChange("unknown")}
                  >
                    <Icon icon="lucide:x" width={16} className="text-default-400" />
                  </Button>
                )}
              </ButtonGroup>
            </div>

            {/* Tags Input */}
            <div className="col-span-12 md:col-span-6">
              <label className="text-small font-medium text-default-700 mb-2 block">
                Tags
              </label>
              <Input
                placeholder="Type a tag and press Enter"
                startContent={
                  <Icon className="text-default-400" icon="lucide:tag" />
                }
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      color="primary"
                      variant="flat"
                      onClose={() => removeTag(tag)}
                      size="sm"
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              )}
            </div>
            <Textarea
              className="col-span-12"
              label="Notes"
              labelPlacement="inside"
              maxRows={6}
              minRows={3}
              placeholder="Add any additional notes or comments about this contact..."
              value={businessCardData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <Button
          color="primary"
          size="lg"
          isDisabled={!businessCardData.pool_id || loading}
          isLoading={loading}
          startContent={<Icon icon="lucide:save" width={20} />}
          className="px-8"
          onPress={handleSubmit}
        >
          Save & Continue
        </Button>
      </div>
    </>
  );
};

export default EditDataStep;
