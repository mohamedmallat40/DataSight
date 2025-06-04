import React, { useState } from "react";
import {
  Input,
  Textarea,
  Button,
  Image,
  Card,
  Divider,
  addToast,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";
import { BusinessCardData } from "./types";
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

  const handleInputChange = (field: keyof BusinessCardData, value: string) => {
    if (field === "email" || field === "phone_number") {
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

  const handleArrayInputChange = (
    field: "email" | "phone_number",
    index: number,
    value: string
  ) => {
    const newArray = [...businessCardData[field]];
    newArray[index] = value;
    setBusinessCardData({
      ...businessCardData,
      [field]: newArray,
    });
  };

  const addArrayItem = (field: "email" | "phone_number") => {
    setBusinessCardData({
      ...businessCardData,
      [field]: [...businessCardData[field], ""],
    });
  };

  const removeArrayItem = (field: "email" | "phone_number", index: number) => {
    if (businessCardData[field].length <= 1) return;

    const newArray = businessCardData[field].filter((_, i) => i !== index);
    setBusinessCardData({
      ...businessCardData,
      [field]: newArray,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(
        "/update-card-info",
        businessCardData
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

      <div className="grid  gap-6 py-8">
        {/* {uploadedImage && (
          <Card className="col-span-12 md:col-span-4 p-4">
            <Image
              src={uploadedImage}
              alt="Business card"
              className="rounded-medium object-contain w-full max-h-[300px]"
            />
            <Divider className="my-4" />
            <Textarea
              label="Raw Text"
              labelPlacement="outside"
              placeholder="Raw text from business card"
              value={businessCardData.raw_text}
              onChange={(e) => handleInputChange("raw_text", e.target.value)}
              className="w-full"
              minRows={5}
            />
          </Card>
        )} */}

        <div
          className={cn(
            "col-span-12",
            uploadedImage ? "md:col-span-8" : "md:col-span-12"
          )}
        >
          <div className="grid grid-cols-12 gap-4">
            <Input
              label="Full Name"
              labelPlacement="outside"
              placeholder="Full Name"
              value={businessCardData.full_name}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              className="col-span-12 md:col-span-6"
              startContent={
                <Icon icon="lucide:user" className="text-default-400" />
              }
            />

            <Input
              label="Job Title"
              labelPlacement="outside"
              placeholder="Job Title"
              value={businessCardData.job_title}
              onChange={(e) => handleInputChange("job_title", e.target.value)}
              className="col-span-12 md:col-span-6"
              startContent={
                <Icon icon="lucide:briefcase" className="text-default-400" />
              }
            />

            <Input
              label="Company Name"
              labelPlacement="outside"
              placeholder="Company Name"
              value={businessCardData.company_name}
              onChange={(e) =>
                handleInputChange("company_name", e.target.value)
              }
              className="col-span-12"
              startContent={
                <Icon icon="lucide:building" className="text-default-400" />
              }
            />

            <div className="col-span-12">
              <div className="flex items-center justify-between mb-2">
                <label className="text-small font-medium text-default-700">
                  Email Addresses
                </label>
                <Button
                  size="sm"
                  variant="light"
                  color="secondary"
                  onPress={() => addArrayItem("email")}
                  startContent={<Icon icon="lucide:plus" width={16} />}
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
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) =>
                      handleArrayInputChange("email", index, e.target.value)
                    }
                    className="flex-1"
                    startContent={
                      <Icon icon="lucide:mail" className="text-default-400" />
                    }
                  />
                  {businessCardData.email.length > 1 && (
                    <Button
                      isIconOnly
                      variant="light"
                      color="danger"
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
                  size="sm"
                  variant="light"
                  color="secondary"
                  onPress={() => addArrayItem("phone_number")}
                  startContent={<Icon icon="lucide:plus" width={16} />}
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
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) =>
                      handleArrayInputChange(
                        "phone_number",
                        index,
                        e.target.value
                      )
                    }
                    className="flex-1"
                    startContent={
                      <Icon icon="lucide:phone" className="text-default-400" />
                    }
                  />
                  {businessCardData.phone_number.length > 1 && (
                    <Button
                      isIconOnly
                      variant="light"
                      color="danger"
                      onPress={() => removeArrayItem("phone_number", index)}
                    >
                      <Icon icon="lucide:trash-2" width={18} />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Input
              label="Website"
              labelPlacement="outside"
              placeholder="Website"
              value={businessCardData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              className="col-span-12 md:col-span-6"
              startContent={
                <Icon icon="lucide:globe" className="text-default-400" />
              }
            />

            <Input
              label="LinkedIn"
              labelPlacement="outside"
              placeholder="LinkedIn Profile"
              value={businessCardData.linkedin}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
              className="col-span-12 md:col-span-6"
              startContent={
                <Icon icon="lucide:linkedin" className="text-default-400" />
              }
            />

            <Input
              label="Address"
              labelPlacement="outside"
              placeholder="Address"
              value={businessCardData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="col-span-12"
              startContent={
                <Icon icon="lucide:map-pin" className="text-default-400" />
              }
            />

            <Input
              label="City"
              labelPlacement="outside"
              placeholder="City"
              value={businessCardData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="col-span-12 md:col-span-6"
              startContent={
                <Icon icon="lucide:building-2" className="text-default-400" />
              }
            />

            <Input
              label="Country"
              labelPlacement="outside"
              placeholder="Country"
              value={businessCardData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="col-span-12 md:col-span-6"
              startContent={
                <Icon icon="lucide:flag" className="text-default-400" />
              }
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button
          color="primary"
          isLoading={loading}
          onPress={handleSubmit}
          startContent={<Icon icon="lucide:save" />}
        >
          Save & Continue
        </Button>
      </div>
    </>
  );
};

export default EditDataStep;
