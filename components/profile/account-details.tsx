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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
  };

  return (
    <Card className="max-w-4xl w-full" {...props}>
      <CardHeader className="flex flex-col items-start px-6 pb-0 pt-6">
        <div className="flex items-center gap-3 mb-2">
          <Icon icon="solar:user-id-linear" className="text-primary" width={24} />
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
              src={user?.avatar || "https://i.pravatar.cc/150?u=a04258114e29026708c"} 
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
          The photo will be used for your profile, and will be visible to other users of the
          platform.
        </p>
      </CardHeader>
      <CardBody className="px-6">
        <Form validationBehavior="native" onSubmit={handleSubmit}>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            {/* Username */}
            <Input
              isRequired
              name="username"
              label="Username"
              labelPlacement="outside"
              placeholder="Enter username"
              defaultValue={user?.username || ""}
              startContent={<Icon icon="solar:user-speak-linear" className="text-default-400" />}
            />
            
            {/* Email */}
            <Input
              isRequired
              name="email"
              label="Email"
              labelPlacement="outside"
              placeholder="Enter email"
              type="email"
              defaultValue={user?.email || ""}
              startContent={<Icon icon="solar:letter-linear" className="text-default-400" />}
            />
            
            {/* First Name */}
            <Input
              isRequired
              name="firstName"
              label="First Name"
              labelPlacement="outside"
              placeholder="Enter first name"
              defaultValue=""
              startContent={<Icon icon="solar:user-linear" className="text-default-400" />}
            />
            
            {/* Last Name */}
            <Input
              isRequired
              name="lastName"
              label="Last Name"
              labelPlacement="outside"
              placeholder="Enter last name"
              defaultValue=""
              startContent={<Icon icon="solar:user-linear" className="text-default-400" />}
            />
            
            {/* Phone Number */}
            <Input
              isRequired
              name="phone"
              label="Phone Number"
              labelPlacement="outside"
              placeholder="Enter phone number"
              defaultValue=""
              startContent={<Icon icon="solar:phone-linear" className="text-default-400" />}
            />
            
            {/* Country */}
            <Autocomplete
              isRequired
              name="country"
              defaultItems={countries}
              label="Country"
              labelPlacement="outside"
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
              name="state"
              label="State/Province" 
              labelPlacement="outside" 
              placeholder="Enter state or province" 
              defaultValue=""
              startContent={<Icon icon="solar:map-point-linear" className="text-default-400" />}
            />
            
            {/* City */}
            <Input
              name="city"
              label="City"
              labelPlacement="outside"
              placeholder="Enter city"
              defaultValue=""
              startContent={<Icon icon="solar:buildings-linear" className="text-default-400" />}
            />
            
            {/* Address */}
            <Input
              name="address"
              label="Address"
              labelPlacement="outside"
              placeholder="Enter address"
              defaultValue=""
              startContent={<Icon icon="solar:map-point-linear" className="text-default-400" />}
            />
            
            {/* Zip Code */}
            <Input
              name="zipCode"
              label="Zip Code"
              labelPlacement="outside"
              placeholder="Enter zip code"
              defaultValue=""
              startContent={<Icon icon="solar:letter-linear" className="text-default-400" />}
            />

            {/* Company */}
            <Input
              name="company"
              label="Company"
              labelPlacement="outside"
              placeholder="Enter company name"
              defaultValue=""
              startContent={<Icon icon="solar:buildings-3-linear" className="text-default-400" />}
            />

            {/* Job Title */}
            <Input
              name="jobTitle"
              label="Job Title"
              labelPlacement="outside"
              placeholder="Enter job title"
              defaultValue=""
              startContent={<Icon icon="solar:case-linear" className="text-default-400" />}
            />
          </div>

          <div className="mt-8 flex w-full justify-end gap-3">
            <Button 
              radius="full" 
              variant="bordered"
              startContent={<Icon icon="solar:close-circle-linear" />}
            >
              Cancel
            </Button>
            <Button 
              color="primary" 
              radius="full" 
              type="submit"
              isLoading={isLoading}
              startContent={!isLoading ? <Icon icon="solar:diskette-linear" /> : undefined}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}