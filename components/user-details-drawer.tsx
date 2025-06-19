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
  Image,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import type { Users } from "@/types/data";

interface UserDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: () => void;
  userData: Users | null;
}

export default function UserDetailsDrawer({
  isOpen,
  onOpenChange,
  userData,
}: UserDetailsDrawerProps) {
  if (!userData) return null;

  const handleCopyContact = () => {
    const contactInfo = `
Name: ${userData.full_name}
Title: ${userData.job_title || "N/A"}
Company: ${userData.company_name || "N/A"}
Email: ${Array.isArray(userData.email) ? userData.email.join(", ") : userData.email || "N/A"}
Phone: ${Array.isArray(userData.phone_number) ? userData.phone_number.join(", ") : userData.phone_number || "N/A"}
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
      size="lg"
      classNames={{
        base: "data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2 rounded-medium",
      }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {(onClose) => (
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
                  <Icon icon="lucide:chevron-left" width={20} height={20} />
                </Button>
              </Tooltip>
              <div className="w-full flex justify-start gap-2">
                <Button
                  className="font-medium text-small text-default-500"
                  size="sm"
                  startContent={
                    <Icon icon="lucide:copy" width={16} height={16} />
                  }
                  variant="flat"
                  onPress={handleCopyContact}
                >
                  Copy Contact
                </Button>
                <Button
                  className="font-medium text-small text-default-500"
                  endContent={
                    <Icon icon="lucide:external-link" width={16} height={16} />
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
                  <div className="relative">
                    <Avatar
                      name={userData.full_name}
                      size="lg"
                      src={
                        userData.logo_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.full_name)}&background=random&size=200`
                      }
                      className="w-20 h-20"
                    />
                    {userData.gender !== null && (
                      <Chip
                        size="sm"
                        variant="flat"
                        className="absolute -bottom-1 -right-1"
                        startContent={
                          <Icon
                            icon={
                              userData.gender ? "lucide:user" : "lucide:user"
                            }
                            width={12}
                          />
                        }
                      >
                        {userData.gender ? "M" : "F"}
                      </Chip>
                    )}
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
                        <Chip size="sm" variant="flat" color="primary">
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
                        icon="lucide:contact"
                        className="text-primary"
                        width={20}
                        height={20}
                      />
                      <h3 className="text-lg font-semibold">
                        Contact Information
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0 space-y-4">
                    {/* Email */}
                    {primaryEmail && (
                      <div className="flex gap-3 items-start">
                        <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-10 h-10 mt-1">
                          <Icon
                            icon="lucide:mail"
                            className="text-default-500"
                            width={18}
                            height={18}
                          />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <Link
                            isExternal
                            showAnchorIcon
                            href={`mailto:${primaryEmail}`}
                            className="text-medium text-foreground font-medium"
                          >
                            {primaryEmail}
                          </Link>
                          {secondaryEmail && (
                            <Link
                              isExternal
                              href={`mailto:${secondaryEmail}`}
                              className="text-small text-default-500"
                            >
                              {secondaryEmail}
                            </Link>
                          )}
                          <p className="text-tiny text-default-400">Email</p>
                        </div>
                      </div>
                    )}

                    {/* Phone */}
                    {primaryPhone && (
                      <div className="flex gap-3 items-start">
                        <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-10 h-10 mt-1">
                          <Icon
                            icon="lucide:phone"
                            className="text-default-500"
                            width={18}
                            height={18}
                          />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <Link
                            isExternal
                            showAnchorIcon
                            href={`tel:${primaryPhone}`}
                            className="text-medium text-foreground font-medium"
                          >
                            {primaryPhone}
                          </Link>
                          {secondaryPhone && (
                            <Link
                              isExternal
                              href={`tel:${secondaryPhone}`}
                              className="text-small text-default-500"
                            >
                              {secondaryPhone}
                            </Link>
                          )}
                          <p className="text-tiny text-default-400">Phone</p>
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
                          icon="lucide:globe"
                          className="text-primary"
                          width={20}
                          height={20}
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
                              icon="lucide:globe"
                              className="text-default-500"
                              width={18}
                              height={18}
                            />
                          </div>
                          <div className="flex flex-col gap-0.5 flex-1">
                            <Link
                              isExternal
                              showAnchorIcon
                              href={
                                userData.website.startsWith("http")
                                  ? userData.website
                                  : `https://${userData.website}`
                              }
                              className="text-medium text-foreground font-medium"
                            >
                              {userData.website}
                            </Link>
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
                              icon="lucide:linkedin"
                              className="text-blue-600"
                              width={18}
                              height={18}
                            />
                          </div>
                          <div className="flex flex-col gap-0.5 flex-1">
                            <Link
                              isExternal
                              showAnchorIcon
                              href={
                                userData.linkedin.startsWith("http")
                                  ? userData.linkedin
                                  : `https://linkedin.com/in/${userData.linkedin}`
                              }
                              className="text-medium text-foreground font-medium"
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
                              icon="lucide:twitter"
                              className="text-blue-500"
                              width={18}
                              height={18}
                            />
                          </div>
                          <div className="flex flex-col gap-0.5 flex-1">
                            <Link
                              isExternal
                              showAnchorIcon
                              href={
                                userData.twitter.startsWith("http")
                                  ? userData.twitter
                                  : `https://twitter.com/${userData.twitter}`
                              }
                              className="text-medium text-foreground font-medium"
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
                              icon="lucide:facebook"
                              className="text-blue-700"
                              width={18}
                              height={18}
                            />
                          </div>
                          <div className="flex flex-col gap-0.5 flex-1">
                            <Link
                              isExternal
                              showAnchorIcon
                              href={
                                userData.facebook.startsWith("http")
                                  ? userData.facebook
                                  : `https://facebook.com/${userData.facebook}`
                              }
                              className="text-medium text-foreground font-medium"
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
                          icon="lucide:map-pin"
                          className="text-primary"
                          width={20}
                          height={20}
                        />
                        <h3 className="text-lg font-semibold">Location</h3>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-0">
                      <div className="flex gap-3 items-start">
                        <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-10 h-10 mt-1">
                          <Icon
                            icon="lucide:map-pin"
                            className="text-default-500"
                            width={18}
                            height={18}
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
                        icon="lucide:info"
                        className="text-primary"
                        width={20}
                        height={20}
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
                          icon="lucide:calendar"
                          className="text-default-400"
                          width={16}
                          height={16}
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
                          icon="lucide:source"
                          className="text-default-400"
                          width={16}
                          height={16}
                        />
                        <div>
                          <p className="text-small font-medium">Source</p>
                          <Chip size="sm" variant="flat" color="secondary">
                            {userData.source}
                          </Chip>
                        </div>
                      </div>
                    )}

                    {userData.ocr_confidence !== null && (
                      <div className="flex items-center gap-3">
                        <Icon
                          icon="lucide:scan-text"
                          className="text-default-400"
                          width={16}
                          height={16}
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
                          icon="lucide:clock"
                          className="text-default-400"
                          width={16}
                          height={16}
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

                {/* Card Images */}
                {(userData.card_image_url ||
                  userData.front_image_link ||
                  userData.back_image_link) && (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="lucide:image"
                          className="text-primary"
                          width={20}
                          height={20}
                        />
                        <h3 className="text-lg font-semibold">
                          Business Card Images
                        </h3>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-0">
                      <div className="flex flex-wrap gap-3">
                        {userData.card_image_url && (
                          <div className="flex-1 min-w-[140px]">
                            <p className="text-tiny text-default-400 mb-2">
                              Card Image
                            </p>
                            <Image
                              src={
                                userData.card_image_url.startsWith("http")
                                  ? userData.card_image_url
                                  : `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:perla-storage/${userData.card_image_url}`
                              }
                              alt="Business card"
                              className="w-full h-28 object-cover rounded-small border border-default-200 cursor-pointer hover:scale-105 transition-transform"
                              fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9Ijk2IiB2aWV3Qm94PSIwIDAgMTIwIDk2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjRGNEY1Ii8+CjxwYXRoIGQ9Ik00OCA0NEg3MlY0OEg0OFY0NFoiIGZpbGw9IiM5Q0E4QjQiLz4KPHA8at0gc3R5bGU9ImZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmOyBmb250LXNpemU6IDEycHg7IGZpbGw6ICM5Q0E4QjQ7IiB4PSI0NSIgeT0iNTgiPkltYWdlPC90ZXh0Pgo8L3N2Zz4K"
                              onClick={() =>
                                window.open(
                                  userData.card_image_url.startsWith("http")
                                    ? userData.card_image_url
                                    : `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:perla-storage/${userData.card_image_url}`,
                                  "_blank",
                                )
                              }
                            />
                          </div>
                        )}
                        {userData.front_image_link && (
                          <div className="flex-1 min-w-[140px]">
                            <p className="text-tiny text-default-400 mb-2">
                              Front Side
                            </p>
                            <Image
                              src={
                                userData.front_image_link.startsWith("http")
                                  ? userData.front_image_link
                                  : `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:perla-storage/${userData.front_image_link}`
                              }
                              alt="Business card front side"
                              className="w-full h-28 object-cover rounded-small border border-default-200 cursor-pointer hover:scale-105 transition-transform"
                              fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9Ijk2IiB2aWV3Qm94PSIwIDAgMTIwIDk2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjRGNEY1Ii8+CjxwYXRoIGQ9Ik00OCA0NEg3MlY0OEg0OFY0NFoiIGZpbGw9IiM5Q0E4QjQiLz4KPHA8at0gc3R5bGU9ImZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmOyBmb250LXNpemU6IDEycHg7IGZpbGw6ICM5Q0E4QjQ7IiB4PSI0NSIgeT0iNTgiPkZyb250PC90ZXh0Pgo8L3N2Zz4K"
                              onClick={() =>
                                window.open(
                                  userData.front_image_link.startsWith("http")
                                    ? userData.front_image_link
                                    : `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:perla-storage/${userData.front_image_link}`,
                                  "_blank",
                                )
                              }
                            />
                          </div>
                        )}
                        {userData.back_image_link && (
                          <div className="flex-1 min-w-[140px]">
                            <p className="text-tiny text-default-400 mb-2">
                              Back Side
                            </p>
                            <Image
                              src={
                                userData.back_image_link.startsWith("http")
                                  ? userData.back_image_link
                                  : `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:perla-storage/${userData.back_image_link}`
                              }
                              alt="Business card back side"
                              className="w-full h-28 object-cover rounded-small border border-default-200 cursor-pointer hover:scale-105 transition-transform"
                              fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9Ijk2IiB2aWV3Qm94PSIwIDAgMTIwIDk2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjRGNEY1Ii8+CjxwYXRoIGQ9Ik00OCA0NEg3MlY0OEg0OFY0NFoiIGZpbGw9IiM5Q0E4QjQiLz4KPHA8at0gc3R5bGU9ImZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmOyBmb250LXNpemU6IDEycHg7IGZpbGw6ICM5Q0E4QjQ7IiB4PSI0NSIgeT0iNTgiPkJhY2s8L3RleHQ+Cjwvc3ZnPgo="
                              onClick={() =>
                                window.open(
                                  userData.back_image_link.startsWith("http")
                                    ? userData.back_image_link
                                    : `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:perla-storage/${userData.back_image_link}`,
                                  "_blank",
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                      {(userData.front_image_link ||
                        userData.back_image_link ||
                        userData.card_image_url) && (
                        <p className="text-tiny text-default-400 mt-2 flex items-center gap-1">
                          <Icon icon="lucide:info" width={12} height={12} />
                          Click on any image to view in full size
                        </p>
                      )}
                    </CardBody>
                  </Card>
                )}

                {/* Notes */}
                {userData.notes && (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="lucide:sticky-note"
                          className="text-primary"
                          width={20}
                          height={20}
                        />
                        <h3 className="text-lg font-semibold">Notes</h3>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-0">
                      <p className="text-small text-default-600 whitespace-pre-wrap">
                        {userData.notes}
                      </p>
                    </CardBody>
                  </Card>
                )}

                {/* Raw Text */}
                {userData.raw_text && (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="lucide:file-text"
                          className="text-primary"
                          width={20}
                          height={20}
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
    </Drawer>
  );
}
