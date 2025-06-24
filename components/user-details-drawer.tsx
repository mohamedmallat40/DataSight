import type { Users } from "@/types/data";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Link,
  Tooltip,
  Avatar,
  Chip,
  Divider,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { HighlightedText } from "@/utils/search-highlight";
import { ReachabilityChip } from "./table/reachability-chip";
import { GenderIndicator } from "./table/gender-indicator";

interface UserDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: () => void;
  userData: Users | null;
  searchTerm?: string;
}

export default function UserDetailsDrawer({
  isOpen,
  onOpenChange,
  userData,
  searchTerm = "",
}: UserDetailsDrawerProps) {
  const {
    isOpen: isImageModalOpen,
    onOpen: onImageModalOpen,
    onOpenChange: onImageModalOpenChange,
  } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    alt: string;
  } | null>(null);

  if (!userData) return null;

  const handleImageClick = (imageUrl: string, title: string, alt: string) => {
    console.log("🖼️ handleImageClick called!", { imageUrl, title, alt });

    const fullImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:perla-storage/${imageUrl}`;

    console.log("📷 Full Image URL:", fullImageUrl);
    console.log("🚀 Setting selected image and opening modal...");

    setSelectedImage({
      url: fullImageUrl,
      title,
      alt,
    });

    console.log("🔥 Calling onImageModalOpen...");
    onImageModalOpen();
    console.log("✅ Modal should be opening now!");
  };

  const handleCopyContact = () => {
    const emails = Array.isArray(userData.email)
      ? userData.email.filter((email) => email && email.trim() !== "")
      : userData.email
        ? [userData.email]
        : [];
    const phones = Array.isArray(userData.phone_number)
      ? userData.phone_number.filter((phone) => phone && phone.trim() !== "")
      : userData.phone_number
        ? [userData.phone_number]
        : [];

    const emailList = emails.length > 0 ? emails.join(", ") : "N/A";
    const phoneList = phones.length > 0 ? phones.join(", ") : "N/A";

    const contactInfo = `
Name: ${userData.full_name}
Title: ${userData.job_title || "N/A"}
Company: ${userData.company_name || "N/A"}
Emails (${emails.length}): ${emailList}
Phones (${phones.length}): ${phoneList}
Website: ${userData.website || "N/A"}
LinkedIn: ${userData.linkedin || "N/A"}
Industry: ${userData.industry || "N/A"}
Address: ${userData.address || "N/A"}
City: ${userData.city || "N/A"}
State: ${userData.state || "N/A"}
Country: ${userData.country || "N/A"}
Postal Code: ${userData.postal_code || "N/A"}
Date Collected: ${userData.date_collected ? new Date(userData.date_collected).toLocaleDateString() : "N/A"}
Source: ${userData.source || "N/A"}
    `.trim();

    navigator.clipboard.writeText(contactInfo);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const emails = Array.isArray(userData.email)
    ? userData.email.filter((email) => email && email.trim() !== "")
    : userData.email
      ? [userData.email]
      : [];
  const phones = Array.isArray(userData.phone_number)
    ? userData.phone_number.filter((phone) => phone && phone.trim() !== "")
    : userData.phone_number
      ? [userData.phone_number]
      : [];

  return (
    <Drawer
      hideCloseButton
      backdrop="blur"
      classNames={{
        base: "data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2 rounded-medium",
      }}
      isOpen={isOpen}
      size="lg"
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {(onClose: () => void) => (
          <>
            <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-4 py-3 border-b border-default-200/50 justify-between bg-content1/80 backdrop-saturate-150 backdrop-blur-lg">
              <Tooltip content="Close">
                <Button
                  isIconOnly
                  className="text-default-400"
                  size="sm"
                  variant="light"
                  onPress={onClose}
                >
                  <Icon height={20} icon="lucide:chevron-left" width={20} />
                </Button>
              </Tooltip>
              <div className="w-full flex justify-start gap-2">
                <Button
                  className="font-medium text-small text-default-500"
                  size="sm"
                  startContent={
                    <Icon height={16} icon="lucide:copy" width={16} />
                  }
                  variant="flat"
                  onPress={handleCopyContact}
                >
                  Copy Contact
                </Button>
                <Button
                  className="font-medium text-small text-default-500"
                  endContent={
                    <Icon height={16} icon="lucide:external-link" width={16} />
                  }
                  size="sm"
                  variant="flat"
                >
                  View Full Profile
                </Button>
              </div>
            </DrawerHeader>

            <DrawerBody className="pt-20 px-4">
              <div className="flex flex-col gap-6">
                {/* Profile Header */}
                <div className="flex items-start gap-4">
                  <div
                    className="relative cursor-pointer group hover:cursor-pointer p-2 -m-2 rounded-full hover:bg-gray-100"
                    style={{ cursor: "pointer" }}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      console.log("🖱️ Avatar container clicked!");
                      e.preventDefault();
                      e.stopPropagation();

                      // Priority: actual photo images first, then generated avatar
                      const avatarUrl =
                        userData.front_image_link ||
                        userData.card_image_url ||
                        userData.logo_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.full_name)}&background=random&size=400`;

                      console.log("🎯 Avatar URL to open:", avatarUrl);
                      handleImageClick(
                        avatarUrl,
                        `${userData.full_name} - Profile`,
                        "Profile image",
                      );
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        const avatarUrl =
                          userData.front_image_link ||
                          userData.card_image_url ||
                          userData.logo_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.full_name)}&background=random&size=400`;
                        handleImageClick(
                          avatarUrl,
                          `${userData.full_name} - Profile`,
                          "Profile image",
                        );
                      }
                    }}
                  >
                    <Avatar
                      className="w-20 h-20 transition-transform group-hover:scale-105 cursor-pointer"
                      name={userData.full_name}
                      size="lg"
                      src={
                        userData.front_image_link ||
                        userData.card_image_url ||
                        userData.logo_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.full_name)}&background=random&size=200`
                      }
                    />
                    {/* Click indicator overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 transform scale-75 group-hover:scale-100 transition-transform duration-200">
                        <Icon
                          className="text-gray-700"
                          height={16}
                          icon="lucide:zoom-in"
                          width={16}
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2">
                      <GenderIndicator
                        gender={userData.gender}
                        variant="badge"
                        className="shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold leading-7">
                      {userData.full_name}
                    </h1>
                    {(userData.first_name || userData.last_name) && (
                      <p className="text-small text-default-400 mb-1">
                        {[userData.first_name, userData.last_name]
                          .filter(Boolean)
                          .join(" ")}
                      </p>
                    )}
                    <div className="flex flex-col gap-1">
                      {userData.job_title && (
                        <p className="text-medium text-default-600">
                          {userData.job_title}
                        </p>
                      )}
                      {userData.company_name && (
                        <p className="text-small text-default-500">
                          {userData.company_name}
                        </p>
                      )}
                      {userData.industry && (
                        <Chip color="primary" size="sm" variant="flat">
                          {userData.industry}
                        </Chip>
                      )}
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Contact Information */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Icon
                        className="text-primary"
                        height={20}
                        icon="lucide:contact"
                        width={20}
                      />
                      <h3 className="text-lg font-semibold">
                        Contact Information
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0 space-y-4">
                    {/* Emails */}
                    {emails.length > 0 && (
                      <div className="flex gap-3 items-start">
                        <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-10 h-10 mt-1">
                          <Icon
                            className="text-default-500"
                            height={18}
                            icon="lucide:mail"
                            width={18}
                          />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          {emails.map((email, index) => (
                            <div key={index} className="flex flex-col gap-0.5">
                              <Link
                                isExternal
                                showAnchorIcon
                                className={`${index === 0 ? "text-medium text-foreground font-medium" : "text-small text-default-600"}`}
                                href={`mailto:${email}`}
                              >
                                {email}
                              </Link>

                              {index > 0 && (
                                <p className="text-tiny text-default-400">
                                  Secondary {index > 1 ? index : ""}
                                </p>
                              )}
                            </div>
                          ))}
                          <div className="flex items-center gap-1 mt-1">
                            <p className="text-tiny text-default-400">
                              {emails.length === 1
                                ? "Email"
                                : `${emails.length} Email addresses`}
                            </p>
                            {emails.length > 1 && (
                              <Chip
                                className="text-tiny"
                                color="primary"
                                size="sm"
                                variant="flat"
                              >
                                {emails.length}
                              </Chip>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Phone Numbers */}
                    {phones.length > 0 && (
                      <div className="flex gap-3 items-start">
                        <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-10 h-10 mt-1">
                          <Icon
                            className="text-default-500"
                            height={18}
                            icon="lucide:phone"
                            width={18}
                          />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          {phones.map((phone, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between gap-2"
                            >
                              <div className="flex flex-col gap-0.5 flex-1">
                                <Link
                                  isExternal
                                  showAnchorIcon
                                  className={`${index === 0 ? "text-medium text-foreground font-medium" : "text-small text-default-600"}`}
                                  href={`tel:${phone}`}
                                >
                                  {phone}
                                </Link>
                              </div>
                              <div className="flex items-center">
                                <Tooltip content="Make a call">
                                  <Button
                                    isIconOnly
                                    className="h-6 w-6 min-w-6 text-blue-500 hover:text-blue-600"
                                    size="sm"
                                    variant="light"
                                    onPress={() => {
                                      window.location.href = `tel:${phone}`;
                                    }}
                                  >
                                    <Icon
                                      className="h-3 w-3"
                                      icon="solar:phone-calling-bold"
                                    />
                                  </Button>
                                </Tooltip>
                                <Tooltip content="Open WhatsApp chat">
                                  <Button
                                    isIconOnly
                                    className="h-6 w-6 min-w-6 text-success-500 hover:text-success-600 -ml-1"
                                    size="sm"
                                    variant="light"
                                    onPress={() => {
                                      const cleanPhone = phone.replace(
                                        /[^\d+]/g,
                                        "",
                                      );
                                      const whatsappUrl = `https://wa.me/${cleanPhone}`;
                                      window.open(
                                        whatsappUrl,
                                        "_blank",
                                        "noopener,noreferrer",
                                      );
                                    }}
                                  >
                                    <Icon
                                      className="h-3 w-3"
                                      icon="ic:baseline-whatsapp"
                                    />
                                  </Button>
                                </Tooltip>
                                <Tooltip content="Copy phone number">
                                  <Button
                                    isIconOnly
                                    className="h-6 w-6 min-w-6 text-default-400 hover:text-primary -ml-1"
                                    size="sm"
                                    variant="light"
                                    onPress={() => {
                                      navigator.clipboard.writeText(phone);
                                    }}
                                  >
                                    <Icon
                                      className="h-3 w-3"
                                      icon="solar:copy-linear"
                                    />
                                  </Button>
                                </Tooltip>
                              </div>
                            </div>
                          ))}
                          <div className="flex items-center gap-1 mt-1">
                            <p className="text-tiny text-default-400">
                              {phones.length === 1
                                ? "Phone"
                                : `${phones.length} Phone numbers`}
                            </p>
                            {phones.length > 1 && (
                              <Chip
                                className="text-tiny"
                                color="primary"
                                size="sm"
                                variant="flat"
                              >
                                {phones.length}
                              </Chip>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>

                {/* Online Presence */}
                {(userData.website ||
                  userData.linkedin ||
                  userData.twitter ||
                  userData.facebook) && (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Icon
                          className="text-primary"
                          height={20}
                          icon="lucide:globe"
                          width={20}
                        />
                        <h3 className="text-lg font-semibold">
                          Online Presence
                        </h3>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-0 space-y-4">
                      {userData.website && (
                        <div className="flex gap-3 items-center">
                          <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-10 h-10">
                            <Icon
                              className="text-default-500"
                              height={18}
                              icon="lucide:globe"
                              width={18}
                            />
                          </div>
                          <div className="flex flex-col gap-0.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Link
                                isExternal
                                showAnchorIcon
                                className="text-medium text-foreground font-medium"
                                href={
                                  userData.website.startsWith("http")
                                    ? userData.website
                                    : `https://${userData.website}`
                                }
                              >
                                {userData.website}
                              </Link>
                              <ReachabilityChip
                                type="website"
                                value={userData.website}
                                size="sm"
                                variant="subtle"
                                className="text-tiny"
                              />
                            </div>
                            <p className="text-tiny text-default-400">
                              Website
                            </p>
                          </div>
                        </div>
                      )}

                      {userData.linkedin && (
                        <div className="flex gap-3 items-center">
                          <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-10 h-10">
                            <Icon
                              className="text-blue-600"
                              height={18}
                              icon="lucide:linkedin"
                              width={18}
                            />
                          </div>
                          <div className="flex flex-col gap-0.5 flex-1">
                            <Link
                              isExternal
                              showAnchorIcon
                              className="text-medium text-foreground font-medium"
                              href={
                                userData.linkedin.startsWith("http")
                                  ? userData.linkedin
                                  : `https://linkedin.com/in/${userData.linkedin}`
                              }
                            >
                              LinkedIn Profile
                            </Link>
                            <p className="text-tiny text-default-400">
                              Professional Network
                            </p>
                          </div>
                        </div>
                      )}

                      {userData.twitter && (
                        <div className="flex gap-3 items-center">
                          <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-10 h-10">
                            <Icon
                              className="text-blue-500"
                              height={18}
                              icon="lucide:twitter"
                              width={18}
                            />
                          </div>
                          <div className="flex flex-col gap-0.5 flex-1">
                            <Link
                              isExternal
                              showAnchorIcon
                              className="text-medium text-foreground font-medium"
                              href={
                                userData.twitter.startsWith("http")
                                  ? userData.twitter
                                  : `https://twitter.com/${userData.twitter}`
                              }
                            >
                              Twitter Profile
                            </Link>
                            <p className="text-tiny text-default-400">
                              Social Media
                            </p>
                          </div>
                        </div>
                      )}

                      {userData.facebook && (
                        <div className="flex gap-3 items-center">
                          <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-10 h-10">
                            <Icon
                              className="text-blue-700"
                              height={18}
                              icon="lucide:facebook"
                              width={18}
                            />
                          </div>
                          <div className="flex flex-col gap-0.5 flex-1">
                            <Link
                              isExternal
                              showAnchorIcon
                              className="text-medium text-foreground font-medium"
                              href={
                                userData.facebook.startsWith("http")
                                  ? userData.facebook
                                  : `https://facebook.com/${userData.facebook}`
                              }
                            >
                              Facebook Profile
                            </Link>
                            <p className="text-tiny text-default-400">
                              Social Media
                            </p>
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                )}

                {/* Business Card Images */}
                {(userData.card_image_url ||
                  userData.front_image_link ||
                  userData.back_image_link) && (
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-3 bg-gradient-to-r from-primary-50 to-secondary-50">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Icon
                              className="text-primary"
                              height={20}
                              icon="lucide:images"
                              width={20}
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              Business Card Gallery
                            </h3>
                            <p className="text-tiny text-default-500">
                              {
                                [
                                  userData.card_image_url,
                                  userData.front_image_link,
                                  userData.back_image_link,
                                ].filter(Boolean).length
                              }{" "}
                              image(s) available
                            </p>
                          </div>
                        </div>
                        <Chip
                          color="primary"
                          size="sm"
                          startContent={<Icon icon="lucide:image" width={14} />}
                          variant="flat"
                        >
                          High Quality
                        </Chip>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userData.card_image_url && (
                          <div className="group relative">
                            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 p-1">
                              <div className="relative overflow-hidden rounded-lg bg-white">
                                <img
                                  alt="Business card"
                                  className="w-full h-36 object-cover cursor-pointer transition-all duration-300 group-hover:scale-110"
                                  src={
                                    userData.card_image_url.startsWith("http")
                                      ? userData.card_image_url
                                      : `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:perla-storage/${userData.card_image_url}`
                                  }
                                  onClick={() =>
                                    userData.card_image_url &&
                                    handleImageClick(
                                      userData.card_image_url,
                                      "Business Card",
                                      "Business card image",
                                    )
                                  }
                                  onError={(e) => {
                                    console.error(
                                      "Gallery image failed to load:",
                                      userData.card_image_url,
                                    );
                                    e.currentTarget.src =
                                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9Ijk2IiB2aWV3Qm94PSIwIDAgMTIwIDk2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjRGNEY1Ii8+CjxwYXRoIGQ9Ik00OCA0NEg3MlY0OEg0OFY0NFoiIGZpbGw9IiM5Q0E4QjQiLz4KPHA8at0gc3R5bGU9ImZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmOyBmb250LXNpemU6IDEycHg7IGZpbGw6ICM5Q0E4QjQ7IiB4PSI0NSIgeT0iNTgiPkltYWdlPC90ZXh0Pgo8L3N2Zz4K";
                                  }}
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                    <Icon
                                      className="text-gray-700"
                                      height={20}
                                      icon="lucide:zoom-in"
                                      width={20}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Label */}
                            <div className="mt-3 text-center">
                              <div className="flex items-center justify-center gap-2 mb-1">
                                <Icon
                                  className="text-primary"
                                  height={16}
                                  icon="lucide:credit-card"
                                  width={16}
                                />
                                <p className="text-small font-medium text-foreground">
                                  Business Card
                                </p>
                              </div>
                              <p className="text-tiny text-default-400">
                                Full card image
                              </p>
                            </div>
                          </div>
                        )}

                        {userData.front_image_link && (
                          <div className="group relative">
                            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 p-1">
                              <div className="relative overflow-hidden rounded-lg bg-white">
                                <img
                                  alt="Business card front side"
                                  className="w-full h-36 object-cover cursor-pointer transition-all duration-300 group-hover:scale-110"
                                  src={
                                    userData.front_image_link.startsWith("http")
                                      ? userData.front_image_link
                                      : `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:perla-storage/${userData.front_image_link}`
                                  }
                                  onClick={(e) => {
                                    console.log("🃏 Front card image clicked!");
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (userData.front_image_link) {
                                      console.log(
                                        "📸 Front image URL:",
                                        userData.front_image_link,
                                      );
                                      handleImageClick(
                                        userData.front_image_link,
                                        "Business Card - Front",
                                        "Business card front side",
                                      );
                                    } else {
                                      console.log(
                                        "❌ No front image available",
                                      );
                                    }
                                  }}
                                  onError={(e) => {
                                    console.error(
                                      "Front image failed to load:",
                                      userData.front_image_link,
                                    );
                                    e.currentTarget.src =
                                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9Ijk2IiB2aWV3Qm94PSIwIDAgMTIwIDk2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjRGNEY1Ii8+CjxwYXRoIGQ9Ik00OCA0NEg3MlY0OEg0OFY0NFoiIGZpbGw9IiM5Q0E4QjQiLz4KPHA<at0gc3R5bGU9ImZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmOyBmb250LXNpemU6IDEycHg7IGZpbGw6ICM5Q0E4QjQ7IiB4PSI0NSIgeT0iNTgiPkZyb250PC90ZXh0Pgo8L3N2Zz4K";
                                  }}
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                    <Icon
                                      className="text-gray-700"
                                      height={20}
                                      icon="lucide:zoom-in"
                                      width={20}
                                    />
                                  </div>
                                </div>

                                {/* Front Badge */}
                                <div className="absolute top-2 left-2">
                                  <Chip
                                    className="text-tiny"
                                    color="primary"
                                    size="sm"
                                    variant="flat"
                                  >
                                    Front
                                  </Chip>
                                </div>
                              </div>
                            </div>

                            {/* Label */}
                            <div className="mt-3 text-center">
                              <div className="flex items-center justify-center gap-2 mb-1">
                                <Icon
                                  className="text-blue-600"
                                  height={16}
                                  icon="lucide:square-user"
                                  width={16}
                                />
                                <p className="text-small font-medium text-foreground">
                                  Front Side
                                </p>
                              </div>
                              <p className="text-tiny text-default-400">
                                Contact information
                              </p>
                            </div>
                          </div>
                        )}

                        {userData.back_image_link && (
                          <div className="group relative">
                            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-100 to-green-200 p-1">
                              <div className="relative overflow-hidden rounded-lg bg-white">
                                <img
                                  alt="Business card back side"
                                  className="w-full h-36 object-cover cursor-pointer transition-all duration-300 group-hover:scale-110"
                                  src={
                                    userData.back_image_link.startsWith("http")
                                      ? userData.back_image_link
                                      : `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:perla-storage/${userData.back_image_link}`
                                  }
                                  onClick={(e) => {
                                    console.log("🃏 Back card image clicked!");
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (userData.back_image_link) {
                                      console.log(
                                        "📸 Back image URL:",
                                        userData.back_image_link,
                                      );
                                      handleImageClick(
                                        userData.back_image_link,
                                        "Business Card - Back",
                                        "Business card back side",
                                      );
                                    } else {
                                      console.log("❌ No back image available");
                                    }
                                  }}
                                  onError={(e) => {
                                    console.error(
                                      "Back image failed to load:",
                                      userData.back_image_link,
                                    );
                                    e.currentTarget.src =
                                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9Ijk2IiB2aWV3Qm94PSIwIDAgMTIwIDk2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjRGNEY1Ii8+CjxwYXRoIGQ9Ik00OCA0NEg3MlY0OEg0OFY0NEoiIGZpbGw9IiM5Q0E4QjQiLz4KPHA<at0gc3R5bGU9ImZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmOyBmb250LXNpemU6IDEycHg7IGZpbGw6ICM5Q0E4QjQ7IiB4PSI0NSIgeT0iNTgiPkJhY2s8L3RleHQ+Cjwvc3ZnPgo=";
                                  }}
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                    <Icon
                                      className="text-gray-700"
                                      height={20}
                                      icon="lucide:zoom-in"
                                      width={20}
                                    />
                                  </div>
                                </div>

                                {/* Back Badge */}
                                <div className="absolute top-2 left-2">
                                  <Chip
                                    className="text-tiny"
                                    color="success"
                                    size="sm"
                                    variant="flat"
                                  >
                                    Back
                                  </Chip>
                                </div>
                              </div>
                            </div>

                            {/* Label */}
                            <div className="mt-3 text-center">
                              <div className="flex items-center justify-center gap-2 mb-1">
                                <Icon
                                  className="text-green-600"
                                  height={16}
                                  icon="lucide:flip-horizontal"
                                  width={16}
                                />
                                <p className="text-small font-medium text-foreground">
                                  Back Side
                                </p>
                              </div>
                              <p className="text-tiny text-default-400">
                                Additional information
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Info Section */}
                      <div className="mt-6 p-4 bg-gradient-to-r from-default-50 to-primary-50 rounded-xl border border-default-200">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                            <Icon
                              className="text-primary"
                              height={16}
                              icon="lucide:info"
                              width={16}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-small font-semibold text-foreground mb-1">
                              Image Gallery Tips
                            </h4>
                            <div className="space-y-1 text-tiny text-default-600">
                              <p className="flex items-center gap-2">
                                <Icon
                                  height={12}
                                  icon="lucide:mouse-pointer-click"
                                  width={12}
                                />
                                Click any image to view in full-screen mode
                              </p>
                              <p className="flex items-center gap-2">
                                <Icon
                                  height={12}
                                  icon="lucide:zoom-in"
                                  width={12}
                                />
                                Hover over images for zoom preview
                              </p>
                              <p className="flex items-center gap-2">
                                <Icon
                                  height={12}
                                  icon="lucide:download"
                                  width={12}
                                />
                                Use the external link button to download
                                original
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}

                {/* Location Information */}
                {(userData.address ||
                  userData.street ||
                  userData.city ||
                  userData.state ||
                  userData.country ||
                  userData.postal_code) && (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Icon
                          className="text-primary"
                          height={20}
                          icon="lucide:map-pin"
                          width={20}
                        />
                        <h3 className="text-lg font-semibold">Location</h3>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-0">
                      <div className="flex gap-3 items-start">
                        <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-10 h-10 mt-1">
                          <Icon
                            className="text-default-500"
                            height={18}
                            icon="lucide:map-pin"
                            width={18}
                          />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          {userData.address && (
                            <p className="text-medium text-foreground font-medium">
                              {userData.address}
                            </p>
                          )}
                          {userData.street &&
                            userData.street !== userData.address && (
                              <p className="text-small text-default-600">
                                {userData.street}
                              </p>
                            )}
                          <div className="flex flex-wrap gap-1 text-small text-default-500">
                            {userData.city && <span>{userData.city}</span>}
                            {userData.state && <span>, {userData.state}</span>}
                            {userData.postal_code && (
                              <span> {userData.postal_code}</span>
                            )}
                          </div>
                          {userData.country && (
                            <p className="text-small text-default-500">
                              {userData.country}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}

                {/* Additional Information */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Icon
                        className="text-primary"
                        height={20}
                        icon="lucide:info"
                        width={20}
                      />
                      <h3 className="text-lg font-semibold">
                        Additional Details
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0 space-y-3">
                    {userData.date_collected && (
                      <div className="flex items-center gap-3">
                        <Icon
                          className="text-default-400"
                          height={16}
                          icon="lucide:calendar"
                          width={16}
                        />
                        <div>
                          <p className="text-small font-medium">
                            Date Collected
                          </p>
                          <p className="text-tiny text-default-500">
                            {formatDate(userData.date_collected)}
                          </p>
                        </div>
                      </div>
                    )}

                    {userData.source && (
                      <div className="flex items-center gap-3">
                        <Icon
                          className="text-default-400"
                          height={16}
                          icon="lucide:source"
                          width={16}
                        />
                        <div>
                          <p className="text-small font-medium">Source</p>
                          <Chip color="secondary" size="sm" variant="flat">
                            {userData.source}
                          </Chip>
                        </div>
                      </div>
                    )}

                    {userData.ocr_confidence !== null && (
                      <div className="flex items-center gap-3">
                        <Icon
                          className="text-default-400"
                          height={16}
                          icon="lucide:scan-text"
                          width={16}
                        />
                        <div>
                          <p className="text-small font-medium">
                            OCR Confidence
                          </p>
                          <p className="text-tiny text-default-500">
                            {(userData.ocr_confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    )}

                    {userData.collected_at && (
                      <div className="flex items-center gap-3">
                        <Icon
                          className="text-default-400"
                          height={16}
                          icon="lucide:clock"
                          width={16}
                        />
                        <div>
                          <p className="text-small font-medium">Collected At</p>
                          <p className="text-tiny text-default-500">
                            {formatDate(userData.collected_at)}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>

                {/* Notes */}
                {userData.notes && (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Icon
                          className="text-primary"
                          height={20}
                          icon="lucide:sticky-note"
                          width={20}
                        />
                        <h3 className="text-lg font-semibold">Notes</h3>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-0">
                      <div className="text-small text-default-600 whitespace-pre-wrap">
                        {searchTerm ? (
                          <HighlightedText
                            highlightClassName="bg-yellow-200 text-yellow-900 px-0.5 rounded-sm font-medium"
                            searchTerm={searchTerm}
                            text={userData.notes}
                          />
                        ) : (
                          userData.notes
                        )}
                      </div>
                    </CardBody>
                  </Card>
                )}

                {/* Raw Text */}
                {userData.raw_text && (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Icon
                          className="text-primary"
                          height={20}
                          icon="lucide:file-text"
                          width={20}
                        />
                        <h3 className="text-lg font-semibold">Raw OCR Text</h3>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-0">
                      <div className="bg-default-100 rounded-small p-3">
                        <p className="text-tiny text-default-600 whitespace-pre-wrap font-mono">
                          {userData.raw_text}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>
            </DrawerBody>

            <DrawerFooter className="flex flex-row gap-2 justify-end">
              <Button variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" variant="flat">
                Edit Contact
              </Button>
              <Button color="danger" variant="light">
                Delete Contact
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>

      {/* Enhanced Image Modal */}
      <Modal
        backdrop="opaque"
        classNames={{
          backdrop: "bg-black/90 backdrop-blur-sm",
          base: "border-none bg-transparent shadow-none max-w-[95vw] max-h-[95vh]",
          wrapper: "items-center justify-center p-4",
        }}
        isOpen={isImageModalOpen}
        size="5xl"
        onOpenChange={onImageModalOpenChange}
      >
        <ModalContent className="bg-transparent shadow-none overflow-hidden">
          {(onClose: () => void) => (
            <>
              {/* Enhanced Header */}
              <ModalHeader className="flex flex-col gap-1 bg-content1/95 backdrop-blur-xl rounded-t-2xl border-b border-default-200/50 shadow-lg">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl">
                      <Icon
                        className="text-primary"
                        height={20}
                        icon="lucide:image"
                        width={20}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {selectedImage?.title}
                      </h3>
                      <p className="text-tiny text-default-500">
                        High resolution view
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Download image">
                      <Button
                        isIconOnly
                        className="bg-primary/10 hover:bg-primary/20"
                        color="primary"
                        size="sm"
                        variant="flat"
                        onPress={() =>
                          selectedImage &&
                          window.open(selectedImage.url, "_blank")
                        }
                      >
                        <Icon height={16} icon="lucide:download" width={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Open in new tab">
                      <Button
                        isIconOnly
                        className="bg-default-100 hover:bg-default-200"
                        size="sm"
                        variant="flat"
                        onPress={() =>
                          selectedImage &&
                          window.open(selectedImage.url, "_blank")
                        }
                      >
                        <Icon
                          height={16}
                          icon="lucide:external-link"
                          width={16}
                        />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Close">
                      <Button
                        isIconOnly
                        className="bg-danger/10 hover:bg-danger/20 text-danger"
                        size="sm"
                        variant="flat"
                        onPress={onClose}
                      >
                        <Icon height={16} icon="lucide:x" width={16} />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </ModalHeader>

              {/* Enhanced Body */}
              <ModalBody className="p-0 relative">
                {selectedImage && (
                  <div className="relative bg-white rounded-b-2xl overflow-hidden shadow-2xl">
                    {/* Image Container */}
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 min-h-[400px] flex items-center justify-center">
                      <img
                        alt={selectedImage.alt}
                        className="max-w-full max-h-[75vh] object-contain drop-shadow-lg rounded-lg"
                        src={selectedImage.url}
                        style={{
                          backgroundColor: "white",
                          padding: "8px",
                        }}
                        onError={(e) => {
                          console.error(
                            "Image failed to load:",
                            selectedImage.url,
                          );
                          e.currentTarget.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjRGNEY1Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDIyNVYxNzVIMTc1VjEyNVoiIGZpbGw9IiM5Q0E4QjQiLz4KPHA<at0gc3R5bGU9ImZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmOyBmb250LXNpemU6IDE2cHg7IGZpbGw6ICM5Q0E4QjQ7IHRleHQtYW5jaG9yOiBtaWRkbGU7IiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgeD0iMjAwIiB5PSIyMDAiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=";
                        }}
                        onLoad={() => console.log("Image loaded successfully")}
                      />

                      {/* Decorative corners */}
                      <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
                      <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" />
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />
                    </div>

                    {/* Enhanced Footer */}
                    <div className="bg-gradient-to-r from-content1 to-content2 p-4 border-t border-default-200">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-small">
                              <Icon
                                className="text-primary"
                                height={16}
                                icon="lucide:info"
                                width={16}
                              />
                              <span className="text-default-600">
                                Business Card Image
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-tiny text-default-500">
                            <div className="flex items-center gap-1">
                              <Icon
                                height={12}
                                icon="lucide:mouse-pointer-click"
                                width={12}
                              />
                              <span>Click outside to close</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon
                                height={12}
                                icon="lucide:keyboard"
                                width={12}
                              />
                              <span>Press ESC to close</span>
                            </div>
                          </div>
                        </div>

                        {/* Debug URL display */}
                        <div className="text-tiny text-default-400 bg-default-100 rounded-small p-2 font-mono">
                          <div className="flex items-center gap-2">
                            <Icon height={12} icon="lucide:link" width={12} />
                            <span className="break-all">
                              {selectedImage?.url}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </Drawer>
  );
}
