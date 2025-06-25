import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  Card,
  CardBody,
  addToast,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

import type { Users } from "../../types/data";

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

interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  userData: Users | null;
  onSuccess?: () => void;
}

export default function EditUserModal({
  isOpen,
  onOpenChange,
  userData,
  onSuccess,
}: EditUserModalProps) {
  const [formData, setFormData] = useState<Partial<Users>>({});
  const [loading, setLoading] = useState(false);
  const [pools, setPools] = useState<Pool[]>([]);

  // Initialize form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({ ...userData });
    }
  }, [userData]);

  // Fetch pools on component mount
  useEffect(() => {
    if (isOpen) {
      fetchPools();
    }
  }, [isOpen]);

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

  // Handle single field changes
  const handleInputChange = (field: keyof Users, value: string) => {
    if (field === "email" || field === "phone_number") {
      // For array fields, split by comma and clean up
      const arrayValue = value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
      setFormData({
        ...formData,
        [field]: arrayValue.length > 0 ? arrayValue : [""],
      });
    } else {
      setFormData({
        ...formData,
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
    setFormData({
      ...formData,
      gender: genderValue,
    });
  };

  // Handle array field changes
  const handleArrayInputChange = (
    field: "email" | "phone_number",
    index: number,
    value: string,
  ) => {
    const currentArray = formData[field] || [];
    const newArray = [...currentArray];

    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  // Add new item to array fields
  const addArrayItem = (field: "email" | "phone_number") => {
    const currentArray = formData[field] || [];

    setFormData({
      ...formData,
      [field]: [...currentArray, ""],
    });
  };

  // Remove item from array fields
  const removeArrayItem = (field: "email" | "phone_number", index: number) => {
    const currentArray = formData[field] || [];

    if (currentArray.length <= 1) return;

    const newArray = currentArray.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  // Submit form
  const handleSubmit = async () => {
    if (!formData.id) {
      addToast({
        title: "Error",
        description: "User ID is missing",
        color: "danger",
      });

      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.put(`/users/${formData.id}`, formData);

      if (response.status === 200 || response.status === 201) {
        addToast({
          title: "Success!",
          description: "User information has been updated successfully",
          color: "success",
        });
        onSuccess?.();
        onOpenChange();
      } else {
        addToast({
          title: "Unexpected Response",
          description: `Received status ${response.status}`,
          color: "warning",
        });
      }
    } catch (error: any) {
      console.error("Update error:", error);
      addToast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Error occurred while updating user information",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const getGenderValue = () => {
    if (formData.gender === true) return "male";
    if (formData.gender === false) return "female";

    return "unknown";
  };

  const getGenderDisplayValue = () => {
    const genderValue = getGenderValue();

    return genderValue === "unknown" ? new Set([]) : new Set([genderValue]);
  };

  if (!userData) return null;

  return (
    <Modal
      classNames={{
        base: "max-w-6xl",
        body: "p-0",
        header: "border-b border-divider",
        footer: "border-t border-divider",
      }}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
      size="5xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-6 py-4">
              <div className="flex items-center gap-3">
                <Icon
                  className="text-primary"
                  icon="solar:user-edit-bold"
                  width={24}
                />
                <div>
                  <h2 className="text-lg font-semibold">Edit Contact</h2>
                  <p className="text-sm text-default-500 font-normal">
                    Update contact information for {formData.full_name}
                  </p>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="px-6 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Personal Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-default-700 mb-4 flex items-center gap-2">
                      <Icon
                        className="text-primary"
                        icon="solar:user-id-bold"
                        width={20}
                      />
                      Personal Information
                    </h3>
                    <div className="space-y-6">
                      <Input
                        label="Full Name"
                        labelPlacement="outside"
                        placeholder="Enter full name"
                        startContent={
                          <Icon
                            className="text-default-400"
                            icon="solar:user-linear"
                            width={18}
                          />
                        }
                        value={formData.full_name || ""}
                        onChange={(e) =>
                          handleInputChange("full_name", e.target.value)
                        }
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="First Name"
                          labelPlacement="outside"
                          placeholder="First name"
                          value={formData.first_name || ""}
                          onChange={(e) =>
                            handleInputChange("first_name", e.target.value)
                          }
                        />
                        <Input
                          label="Last Name"
                          labelPlacement="outside"
                          placeholder="Last name"
                          value={formData.last_name || ""}
                          onChange={(e) =>
                            handleInputChange("last_name", e.target.value)
                          }
                        />
                      </div>

                      <Input
                        label="Job Title"
                        labelPlacement="outside"
                        placeholder="Enter job title"
                        startContent={
                          <Icon
                            className="text-default-400"
                            icon="solar:case-linear"
                            width={18}
                          />
                        }
                        value={formData.job_title || ""}
                        onChange={(e) =>
                          handleInputChange("job_title", e.target.value)
                        }
                      />

                      {/* Gender Selection */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-default-700">
                          Gender
                        </label>
                        <Select
                          aria-label="Select gender"
                          placeholder="Select gender"
                          selectedKeys={getGenderDisplayValue()}
                          startContent={
                            <Icon
                              className="text-default-400"
                              icon="solar:user-linear"
                              width={18}
                            />
                          }
                          onSelectionChange={(keys) => {
                            const selectedKey = Array.from(keys)[0] as string;

                            handleGenderChange(selectedKey || "unknown");
                          }}
                        >
                          <SelectItem key="male" textValue="Male">
                            <div className="flex items-center gap-2">
                              <Icon
                                className="text-blue-500"
                                icon="solar:men-linear"
                                width={16}
                              />
                              Male
                            </div>
                          </SelectItem>
                          <SelectItem key="female" textValue="Female">
                            <div className="flex items-center gap-2">
                              <Icon
                                className="text-pink-500"
                                icon="solar:women-linear"
                                width={16}
                              />
                              Female
                            </div>
                          </SelectItem>
                          <SelectItem key="unknown" textValue="Not Specified">
                            <div className="flex items-center gap-2">
                              <Icon
                                className="text-default-400"
                                icon="solar:user-linear"
                                width={16}
                              />
                              Not Specified
                            </div>
                          </SelectItem>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-base font-semibold text-default-700 mb-4 flex items-center gap-2">
                      <Icon
                        className="text-primary"
                        icon="solar:phone-linear"
                        width={20}
                      />
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      {/* Email Addresses */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-default-700">
                            Email Addresses
                          </label>
                          <Button
                            color="primary"
                            size="sm"
                            startContent={
                              <Icon icon="solar:add-circle-linear" width={16} />
                            }
                            variant="light"
                            onPress={() => addArrayItem("email")}
                          >
                            Add Email
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(formData.email || [""]).map((email, index) => (
                            <div
                              key={`email-${index}`}
                              className="flex items-center gap-2"
                            >
                              <Input
                                className="flex-1"
                                placeholder="Enter email address"
                                startContent={
                                  <Icon
                                    className="text-default-400"
                                    icon="solar:letter-linear"
                                    width={16}
                                  />
                                }
                                type="email"
                                value={email}
                                onChange={(e) =>
                                  handleArrayInputChange(
                                    "email",
                                    index,
                                    e.target.value,
                                  )
                                }
                              />
                              {(formData.email || []).length > 1 && (
                                <Button
                                  isIconOnly
                                  color="danger"
                                  size="sm"
                                  variant="light"
                                  onPress={() =>
                                    removeArrayItem("email", index)
                                  }
                                >
                                  <Icon
                                    icon="solar:trash-bin-minimalistic-linear"
                                    width={16}
                                  />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Phone Numbers */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-default-700">
                            Phone Numbers
                          </label>
                          <Button
                            color="primary"
                            size="sm"
                            startContent={
                              <Icon icon="solar:add-circle-linear" width={16} />
                            }
                            variant="light"
                            onPress={() => addArrayItem("phone_number")}
                          >
                            Add Phone
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(formData.phone_number || [""]).map(
                            (phone, index) => (
                              <div
                                key={`phone-${index}`}
                                className="flex items-center gap-2"
                              >
                                <Input
                                  className="flex-1"
                                  placeholder="Enter phone number"
                                  startContent={
                                    <Icon
                                      className="text-default-400"
                                      icon="solar:phone-linear"
                                      width={16}
                                    />
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
                                {(formData.phone_number || []).length > 1 && (
                                  <Button
                                    isIconOnly
                                    color="danger"
                                    size="sm"
                                    variant="light"
                                    onPress={() =>
                                      removeArrayItem("phone_number", index)
                                    }
                                  >
                                    <Icon
                                      icon="solar:trash-bin-minimalistic-linear"
                                      width={16}
                                    />
                                  </Button>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Company & Location */}
                <div className="space-y-6">
                  {/* Company Information */}
                  <div>
                    <h3 className="text-base font-semibold text-default-700 mb-4 flex items-center gap-2">
                      <Icon
                        className="text-primary"
                        icon="solar:buildings-2-linear"
                        width={20}
                      />
                      Company Information
                    </h3>
                    <div className="space-y-4">
                      <Input
                        label="Company Name"
                        labelPlacement="outside"
                        placeholder="Enter company name"
                        startContent={
                          <Icon
                            className="text-default-400"
                            icon="solar:buildings-linear"
                            width={18}
                          />
                        }
                        value={formData.company_name || ""}
                        onChange={(e) =>
                          handleInputChange("company_name", e.target.value)
                        }
                      />

                      <Input
                        label="Industry"
                        labelPlacement="outside"
                        placeholder="Enter industry"
                        startContent={
                          <Icon
                            className="text-default-400"
                            icon="solar:case-round-linear"
                            width={18}
                          />
                        }
                        value={formData.industry || ""}
                        onChange={(e) =>
                          handleInputChange("industry", e.target.value)
                        }
                      />

                      <Input
                        label="Website"
                        labelPlacement="outside"
                        placeholder="Enter website URL"
                        startContent={
                          <Icon
                            className="text-default-400"
                            icon="solar:globe-linear"
                            width={18}
                          />
                        }
                        value={formData.website || ""}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                      />

                      <Input
                        label="LinkedIn"
                        labelPlacement="outside"
                        placeholder="Enter LinkedIn profile URL"
                        startContent={
                          <Icon
                            className="text-default-400"
                            icon="solar:link-minimalistic-linear"
                            width={18}
                          />
                        }
                        value={formData.linkedin || ""}
                        onChange={(e) =>
                          handleInputChange("linkedin", e.target.value)
                        }
                      />

                      <Input
                        label="Twitter"
                        labelPlacement="outside"
                        placeholder="Enter Twitter profile URL"
                        startContent={
                          <Icon
                            className="text-default-400"
                            icon="solar:hashtag-linear"
                            width={18}
                          />
                        }
                        value={formData.twitter || ""}
                        onChange={(e) =>
                          handleInputChange("twitter", e.target.value)
                        }
                      />

                      <Input
                        label="Facebook"
                        labelPlacement="outside"
                        placeholder="Enter Facebook profile URL"
                        startContent={
                          <Icon
                            className="text-default-400"
                            icon="solar:letter-linear"
                            width={18}
                          />
                        }
                        value={formData.facebook || ""}
                        onChange={(e) =>
                          handleInputChange("facebook", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Location Information */}
                  <div>
                    <h3 className="text-base font-semibold text-default-700 mb-4 flex items-center gap-2">
                      <Icon
                        className="text-primary"
                        icon="solar:map-point-linear"
                        width={20}
                      />
                      Location Information
                    </h3>
                    <div className="space-y-4">
                      <Textarea
                        label="Address"
                        labelPlacement="outside"
                        placeholder="Enter full address"
                        rows={2}
                        startContent={
                          <Icon
                            className="text-default-400"
                            icon="solar:map-point-linear"
                            width={18}
                          />
                        }
                        value={formData.address || ""}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                      />

                      <Input
                        label="Street"
                        labelPlacement="outside"
                        placeholder="Enter street address"
                        value={formData.street || ""}
                        onChange={(e) =>
                          handleInputChange("street", e.target.value)
                        }
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="City"
                          labelPlacement="outside"
                          placeholder="Enter city"
                          value={formData.city || ""}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                        />
                        <Input
                          label="State"
                          labelPlacement="outside"
                          placeholder="Enter state"
                          value={formData.state || ""}
                          onChange={(e) =>
                            handleInputChange("state", e.target.value)
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Postal Code"
                          labelPlacement="outside"
                          placeholder="Enter postal code"
                          value={formData.postal_code || ""}
                          onChange={(e) =>
                            handleInputChange("postal_code", e.target.value)
                          }
                        />
                        <Input
                          label="Country"
                          labelPlacement="outside"
                          placeholder="Enter country"
                          value={formData.country || ""}
                          onChange={(e) =>
                            handleInputChange("country", e.target.value)
                          }
                        />
                      </div>

                      <Input
                        label="Country Code"
                        labelPlacement="outside"
                        placeholder="Enter country code (e.g., US, GB)"
                        value={formData.country_code || ""}
                        onChange={(e) =>
                          handleInputChange("country_code", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Pool Selection */}
                  {pools.length > 0 && (
                    <div>
                      <h3 className="text-base font-semibold text-default-700 mb-4 flex items-center gap-2">
                        <Icon
                          className="text-primary"
                          icon="solar:layers-minimalistic-linear"
                          width={20}
                        />
                        Pool Assignment
                      </h3>
                      <Select
                        label="Pool"
                        labelPlacement="outside"
                        placeholder="Select a pool"
                        selectedKeys={
                          formData.pool_id ? [formData.pool_id] : []
                        }
                        startContent={
                          <Icon
                            className="text-default-400"
                            icon="solar:layers-minimalistic-linear"
                            width={18}
                          />
                        }
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;

                          setFormData({
                            ...formData,
                            pool_id: selectedKey || null,
                          });
                        }}
                      >
                        {pools.map((pool) => (
                          <SelectItem
                            key={pool.id.toString()}
                            value={pool.id.toString()}
                          >
                            {pool.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Section - Full Width */}
              <div className="mt-8">
                <h3 className="text-base font-semibold text-default-700 mb-4 flex items-center gap-2">
                  <Icon
                    className="text-primary"
                    icon="solar:notes-linear"
                    width={20}
                  />
                  Additional Notes
                </h3>
                <Textarea
                  label="Notes"
                  labelPlacement="outside"
                  maxRows={4}
                  minRows={3}
                  placeholder="Add any additional notes or comments about this contact..."
                  startContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:notes-linear"
                      width={18}
                    />
                  }
                  value={formData.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                />
              </div>

              {/* Raw Text Section */}
              {formData.raw_text && (
                <div className="mt-6">
                  <h3 className="text-base font-semibold text-default-700 mb-4 flex items-center gap-2">
                    <Icon
                      className="text-primary"
                      icon="solar:document-text-linear"
                      width={20}
                    />
                    Raw Card Text
                  </h3>
                  <Textarea
                    isReadOnly
                    label="Extracted Text"
                    labelPlacement="outside"
                    maxRows={4}
                    minRows={3}
                    placeholder="No raw text available"
                    value={formData.raw_text || ""}
                  />
                </div>
              )}
            </ModalBody>

            <ModalFooter className="px-6 py-4">
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                isDisabled={loading}
                isLoading={loading}
                startContent={
                  <Icon icon="solar:check-circle-linear" width={18} />
                }
                onPress={handleSubmit}
              >
                {loading ? "Updating..." : "Update Contact"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
