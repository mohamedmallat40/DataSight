"use client";

import type { CardProps } from "@heroui/react";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Avatar,
  Badge,
  Input,
  Autocomplete,
  AutocompleteItem,
  Form,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import countries from "./countries";

import { useAuth } from "@/contexts/auth-context";

export default function AccountDetails(props: CardProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    console.log("Account details update:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
  };

  return (
    <Card className="max-w-4xl w-full" {...props}>
      <CardHeader className="flex flex-col items-start px-6 pb-0 pt-6">
        <div className="flex items-center gap-3 mb-2">
          <Icon
            icon="solar:user-id-linear"
            className="text-primary"
            width={24}
          />
          <p className="text-xl font-semibold">Account Details</p>
        </div>
        <div className="flex gap-4 py-4">
          <Badge
            showOutline
            classNames={{
              badge: "w-5 h-5",
            }}
            color="primary"
            content={
              <Button
                isIconOnly
                className="p-0 text-primary-foreground"
                radius="full"
                size="sm"
                variant="light"
              >
                <Icon icon="solar:pen-2-linear" />
              </Button>
            }
            placement="bottom-right"
            shape="circle"
          >
            <Avatar
              className="h-16 w-16"
              src={
                user?.avatar ||
                "https://i.pravatar.cc/150?u=a04258114e29026708c"
              }
            />
          </Badge>
          <div className="flex flex-col items-start justify-center">
            <p className="font-medium text-lg">{user?.name || "John Doe"}</p>
            <span className="text-small text-default-500">
              {user?.role || "Professional User"}
            </span>
          </div>
        </div>
        <p className="text-small text-default-400">
          The photo will be used for your profile, and will be visible to other
          users of the platform.
        </p>
      </CardHeader>
      <CardBody className="px-6">
        <Form validationBehavior="native" onSubmit={handleSubmit}>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            {/* Username */}
            <Input
              isRequired
              defaultValue={user?.username || ""}
              label="Username"
              labelPlacement="outside"
              name="username"
              placeholder="Enter username"
              startContent={<Icon icon="solar:user-speak-linear" className="text-default-400" />}
            />

            {/* Email */}
            <Input
              isRequired
              defaultValue={user?.email || ""}
              label="Email"
              labelPlacement="outside"
              name="email"
              placeholder="Enter email"
              startContent={<Icon icon="solar:letter-linear" className="text-default-400" />}
              type="email"
            />

            {/* First Name */}
            <Input
              isRequired
              defaultValue=""
              label="First Name"
              labelPlacement="outside"
              name="firstName"
              placeholder="Enter first name"
              startContent={<Icon icon="solar:user-linear" className="text-default-400" />}
            />

            {/* Last Name */}
            <Input
              isRequired
              defaultValue=""
              label="Last Name"
              labelPlacement="outside"
              name="lastName"
              placeholder="Enter last name"
              startContent={<Icon icon="solar:user-linear" className="text-default-400" />}
            />

            {/* Phone Number */}
            <Input
              isRequired
              defaultValue=""
              label="Phone Number"
              labelPlacement="outside"
              name="phone"
              placeholder="Enter phone number"
              startContent={<Icon icon="solar:phone-linear" className="text-default-400" />}
            />

            {/* Country */}
            <Autocomplete
              isRequired
              defaultItems={countries}
              label="Country"
              labelPlacement="outside"
              name="country"
              placeholder="Select country"
              showScrollIndicators={false}
              startContent={<Icon icon="solar:global-linear" className="text-default-400" />}
            >
              {(item) => (
                <AutocompleteItem
                  key={item.code}
                  startContent={
                    <Avatar
                      alt="Country Flag"
                      className="h-6 w-6"
                      src={`https://flagcdn.com/${item.code.toLowerCase()}.svg`}
                    />
                  }
                >
                  {item.name}
                </AutocompleteItem>
              )}
            </Autocomplete>

            {/* State */}
            <Input
              defaultValue=""
              label="State/Province" 
              labelPlacement="outside" 
              name="state" 
              placeholder="Enter state or province"
              startContent={<Icon icon="solar:map-point-linear" className="text-default-400" />}
            />

            {/* City */}
            <Input
              defaultValue=""
              label="City"
              labelPlacement="outside"
              name="city"
              placeholder="Enter city"
              startContent={<Icon icon="solar:buildings-linear" className="text-default-400" />}
            />

            {/* Address */}
            <Input
              defaultValue=""
              label="Address"
              labelPlacement="outside"
              name="address"
              placeholder="Enter address"
              startContent={<Icon icon="solar:map-point-linear" className="text-default-400" />}
            />

            {/* Zip Code */}
            <Input
              defaultValue=""
              label="Zip Code"
              labelPlacement="outside"
              name="zipCode"
              placeholder="Enter zip code"
              startContent={<Icon icon="solar:letter-linear" className="text-default-400" />}
            />

            {/* Company */}
            <Input
              defaultValue=""
              label="Company"
              labelPlacement="outside"
              name="company"
              placeholder="Enter company name"
              startContent={<Icon icon="solar:buildings-3-linear" className="text-default-400" />}
            />

            {/* Job Title */}
            <Input
              defaultValue=""
              label="Job Title"
              labelPlacement="outside"
              name="jobTitle"
              placeholder="Enter job title"
              startContent={<Icon icon="solar:case-linear" className="text-default-400" />}
            />
          </div>

          <div className="mt-8 flex w-full justify-end gap-3">
            <Button
              radius="full" 
              startContent={<Icon icon="solar:close-circle-linear" />}
              variant="bordered"
            >
              Cancel
            </Button>
            <Button
              color="primary" 
              isLoading={isLoading} 
              radius="full"
              startContent={!isLoading ? <Icon icon="solar:diskette-linear" /> : undefined}
              type="submit"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}
