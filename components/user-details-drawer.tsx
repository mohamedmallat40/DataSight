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
Title: ${userData.job_title}
Company: ${userData.company_name}
Email: ${Array.isArray(userData.email) ? userData.email[0] : userData.email || "N/A"}
Phone: ${Array.isArray(userData.phone_number) ? userData.phone_number[0] : userData.phone_number || "N/A"}
Website: ${userData.website || "N/A"}
Address: ${userData.address || "N/A"}
City: ${userData.city || "N/A"}
Country: ${userData.country || "N/A"}
    `.trim();

    navigator.clipboard.writeText(contactInfo);
  };

  const primaryEmail = Array.isArray(userData.email)
    ? userData.email[0]
    : userData.email || "";
  const primaryPhone = Array.isArray(userData.phone_number)
    ? userData.phone_number[0]
    : userData.phone_number || "";

  return (
    <Drawer
      hideCloseButton
      backdrop="blur"
      classNames={{
        base: "data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2 rounded-medium",
      }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
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
            <DrawerBody className="pt-16">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center gap-4">
                  <Avatar
                    name={userData.full_name}
                    size="lg"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.full_name)}&background=random&size=200`}
                  />
                  <div>
                    <h1 className="text-2xl font-bold leading-7">
                      {userData.full_name}
                    </h1>
                    <p className="text-small text-default-500">
                      {userData.job_title
                        ? `${userData.job_title}${userData.company_name ? ` at ${userData.company_name}` : ""}`
                        : userData.company_name || ""}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {primaryEmail && (
                    <div className="flex gap-3 items-center">
                      <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-11 h-11">
                        <Icon
                          icon="lucide:mail"
                          className="text-default-500"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <Link
                          isExternal
                          showAnchorIcon
                          href={`mailto:${primaryEmail}`}
                          className="text-medium text-foreground font-medium"
                        >
                          {primaryEmail}
                        </Link>
                        <p className="text-small text-default-500">Email</p>
                      </div>
                    </div>
                  )}

                  {primaryPhone && (
                    <div className="flex gap-3 items-center">
                      <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-11 h-11">
                        <Icon
                          icon="lucide:phone"
                          className="text-default-500"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <Link
                          isExternal
                          showAnchorIcon
                          href={`tel:${primaryPhone}`}
                          className="text-medium text-foreground font-medium"
                        >
                          {primaryPhone}
                        </Link>
                        <p className="text-small text-default-500">Phone</p>
                      </div>
                    </div>
                  )}

                  {userData.website && (
                    <div className="flex gap-3 items-center">
                      <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-11 h-11">
                        <Icon
                          icon="lucide:globe"
                          className="text-default-500"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
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
                        <p className="text-small text-default-500">Website</p>
                      </div>
                    </div>
                  )}

                  {(userData.address || userData.city || userData.country) && (
                    <div className="flex gap-3 items-center">
                      <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-11 h-11">
                        <Icon
                          icon="lucide:map-pin"
                          className="text-default-500"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {userData.address && (
                          <p className="text-medium text-foreground font-medium">
                            {userData.address}
                          </p>
                        )}
                        <p className="text-small text-default-500">
                          {[userData.city, userData.country]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter className="flex flex-col gap-1">
              <Link className="text-default-400" href="#" size="sm">
                Edit Contact
              </Link>
              <Link className="text-danger" href="#" size="sm">
                Delete Contact
              </Link>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
