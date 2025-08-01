import type { Users } from "@/types/data";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
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
  Badge,
  ScrollShadow,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { motion } from "framer-motion";

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
    const fullImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:perla-storage/${imageUrl}`;

    setSelectedImage({
      url: fullImageUrl,
      title,
      alt,
    });
    onImageModalOpen();
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

    const contactInfo = `
Name: ${userData.full_name}
Title: ${userData.job_title || "N/A"}
Company: ${userData.company_name || "N/A"}
Email: ${emails.join(", ") || "N/A"}
Phone: ${phones.join(", ") || "N/A"}
Website: ${userData.website || "N/A"}
    `.trim();

    navigator.clipboard.writeText(contactInfo);
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
    <>
      <Drawer
        hideCloseButton
        backdrop="blur"
        classNames={{
          base: "data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2 rounded-lg",
          wrapper: "backdrop-blur-md",
        }}
        isOpen={isOpen}
        size="lg"
        onOpenChange={onOpenChange}
      >
        <DrawerContent className="overflow-hidden">
          {(onClose) => (
            <>
              {/* Modern Header */}
              <DrawerHeader className="flex-none border-b border-default-200/50 bg-gradient-to-r from-default-50 to-primary-50/30 px-6 py-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Button
                      isIconOnly
                      radius="full"
                      size="sm"
                      variant="light"
                      className="text-default-500 hover:text-default-700"
                      onPress={onClose}
                    >
                      <Icon icon="solar:arrow-left-linear" width={18} />
                    </Button>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Contact Details</h2>
                      <p className="text-sm text-default-500">Complete profile information</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Copy contact info">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="text-default-600"
                        onPress={handleCopyContact}
                      >
                        <Icon icon="solar:copy-linear" width={16} />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </DrawerHeader>

              {/* Content with ScrollShadow */}
              <DrawerBody className="p-0">
                <ScrollShadow className="h-full">
                  <div className="p-6 space-y-6">
                    {/* Profile Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-4"
                    >
                      <div className="relative">
                        <Badge
                          content=""
                          color={userData.gender === true ? "primary" : userData.gender === false ? "secondary" : "default"}
                          shape="circle"
                          placement="bottom-right"
                          className="w-4 h-4"
                        >
                          <Avatar
                            className="w-16 h-16 cursor-pointer transition-transform hover:scale-105"
                            src={
                              userData.front_image_link ||
                              userData.card_image_url ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.full_name)}&background=random&size=200`
                            }
                            name={userData.full_name}
                            onClick={() => {
                              const avatarUrl = userData.front_image_link ||
                                userData.card_image_url ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.full_name)}&background=random&size=400`;
                              handleImageClick(avatarUrl, `${userData.full_name} - Profile`, "Profile image");
                            }}
                          />
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold text-foreground mb-1 truncate">
                          {userData.full_name}
                        </h1>
                        {userData.job_title && (
                          <p className="text-sm text-default-600 mb-1 truncate">
                            {userData.job_title}
                          </p>
                        )}
                        {userData.company_name && (
                          <p className="text-sm text-default-500 mb-2 truncate">
                            {userData.company_name}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {userData.industry && (
                            <Chip size="sm" variant="flat" color="primary">
                              {userData.industry}
                            </Chip>
                          )}
                          {userData.source && (
                            <Chip size="sm" variant="flat" color="secondary">
                              {userData.source}
                            </Chip>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    <Divider />

                    {/* Contact Information */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Card className="shadow-small">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Icon icon="solar:phone-linear" className="text-primary" width={16} />
                            </div>
                            <h3 className="text-lg font-semibold">Contact</h3>
                          </div>
                        </CardHeader>
                        <CardBody className="pt-0 space-y-4">
                          {/* Emails */}
                          {emails.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-default-600">
                                <Icon icon="solar:letter-linear" width={14} />
                                <span>Email{emails.length > 1 ? "s" : ""}</span>
                                {emails.length > 1 && (
                                  <Chip size="sm" variant="flat" color="primary">
                                    {emails.length}
                                  </Chip>
                                )}
                              </div>
                              {emails.map((email, index) => (
                                <div key={index} className="flex items-center justify-between pl-6">
                                  <Link
                                    href={`mailto:${email}`}
                                    className="text-sm text-foreground hover:text-primary"
                                    isExternal
                                  >
                                    {email}
                                  </Link>
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    className="text-default-400"
                                    onPress={() => navigator.clipboard.writeText(email)}
                                  >
                                    <Icon icon="solar:copy-linear" width={14} />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Phones */}
                          {phones.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-default-600">
                                <Icon icon="solar:phone-linear" width={14} />
                                <span>Phone{phones.length > 1 ? "s" : ""}</span>
                                {phones.length > 1 && (
                                  <Chip size="sm" variant="flat" color="primary">
                                    {phones.length}
                                  </Chip>
                                )}
                              </div>
                              {phones.map((phone, index) => (
                                <div key={index} className="flex items-center justify-between pl-6">
                                  <Link
                                    href={`tel:${phone}`}
                                    className="text-sm text-foreground hover:text-primary"
                                    isExternal
                                  >
                                    {phone}
                                  </Link>
                                  <div className="flex items-center gap-1">
                                    <Tooltip content="Call">
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        className="text-success"
                                        onPress={() => window.location.href = `tel:${phone}`}
                                      >
                                        <Icon icon="solar:phone-calling-linear" width={14} />
                                      </Button>
                                    </Tooltip>
                                    <Tooltip content="WhatsApp">
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        className="text-success"
                                        onPress={() => {
                                          const cleanPhone = phone.replace(/[^\d+]/g, "");
                                          window.open(`https://wa.me/${cleanPhone}`, "_blank");
                                        }}
                                      >
                                        <Icon icon="ic:baseline-whatsapp" width={14} />
                                      </Button>
                                    </Tooltip>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    </motion.div>

                    {/* Online Presence */}
                    {(userData.website || userData.linkedin || userData.twitter || userData.facebook) && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <Card className="shadow-small">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                                <Icon icon="solar:global-linear" className="text-secondary" width={16} />
                              </div>
                              <h3 className="text-lg font-semibold">Online</h3>
                            </div>
                          </CardHeader>
                          <CardBody className="pt-0 space-y-3">
                            {userData.website && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Icon icon="solar:global-linear" className="text-default-500" width={16} />
                                  <Link
                                    href={userData.website.startsWith("http") ? userData.website : `https://${userData.website}`}
                                    className="text-sm text-foreground hover:text-primary"
                                    isExternal
                                  >
                                    Website
                                  </Link>
                                </div>
                                <ReachabilityChip
                                  type="website"
                                  value={userData.website}
                                  size="sm"
                                  variant="subtle"
                                />
                              </div>
                            )}
                            {userData.linkedin && (
                              <div className="flex items-center gap-3">
                                <Icon icon="solar:linkedin-linear" className="text-blue-600" width={16} />
                                <Link
                                  href={userData.linkedin.startsWith("http") ? userData.linkedin : `https://linkedin.com/in/${userData.linkedin}`}
                                  className="text-sm text-foreground hover:text-primary"
                                  isExternal
                                >
                                  LinkedIn
                                </Link>
                              </div>
                            )}
                            {userData.twitter && (
                              <div className="flex items-center gap-3">
                                <Icon icon="solar:twitter-linear" className="text-blue-500" width={16} />
                                <Link
                                  href={userData.twitter.startsWith("http") ? userData.twitter : `https://twitter.com/${userData.twitter}`}
                                  className="text-sm text-foreground hover:text-primary"
                                  isExternal
                                >
                                  Twitter
                                </Link>
                              </div>
                            )}
                            {userData.facebook && (
                              <div className="flex items-center gap-3">
                                <Icon icon="solar:facebook-linear" className="text-blue-700" width={16} />
                                <Link
                                  href={userData.facebook.startsWith("http") ? userData.facebook : `https://facebook.com/${userData.facebook}`}
                                  className="text-sm text-foreground hover:text-primary"
                                  isExternal
                                >
                                  Facebook
                                </Link>
                              </div>
                            )}
                          </CardBody>
                        </Card>
                      </motion.div>
                    )}

                    {/* Location */}
                    {(userData.address || userData.city || userData.country) && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        <Card className="shadow-small">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                                <Icon icon="solar:map-point-linear" className="text-warning" width={16} />
                              </div>
                              <h3 className="text-lg font-semibold">Location</h3>
                            </div>
                          </CardHeader>
                          <CardBody className="pt-0">
                            <div className="space-y-1 text-sm">
                              {userData.address && (
                                <p className="text-foreground font-medium">{userData.address}</p>
                              )}
                              <div className="text-default-600">
                                {[userData.city, userData.state, userData.country]
                                  .filter(Boolean)
                                  .join(", ")}
                              </div>
                              {userData.postal_code && (
                                <p className="text-default-500">{userData.postal_code}</p>
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      </motion.div>
                    )}

                    {/* Business Card Images */}
                    {(userData.card_image_url || userData.front_image_link || userData.back_image_link) && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        <Card className="shadow-small">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                                  <Icon icon="solar:gallery-linear" className="text-success" width={16} />
                                </div>
                                <h3 className="text-lg font-semibold">Images</h3>
                              </div>
                              <Chip size="sm" variant="flat" color="success">
                                {[userData.card_image_url, userData.front_image_link, userData.back_image_link]
                                  .filter(Boolean).length} photo{[userData.card_image_url, userData.front_image_link, userData.back_image_link]
                                  .filter(Boolean).length !== 1 ? "s" : ""}
                              </Chip>
                            </div>
                          </CardHeader>
                          <CardBody className="pt-0">
                            <div className="grid grid-cols-2 gap-3">
                              {userData.front_image_link && (
                                <div
                                  className="aspect-video bg-default-100 rounded-lg overflow-hidden cursor-pointer group relative"
                                  onClick={() => handleImageClick(userData.front_image_link!, "Business Card - Front", "Front side")}
                                >
                                  <img
                                    src={userData.front_image_link.startsWith("http") 
                                      ? userData.front_image_link 
                                      : `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:perla-storage/${userData.front_image_link}`}
                                    alt="Front"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <Icon icon="solar:eye-linear" className="text-white opacity-0 group-hover:opacity-100 transition-opacity" width={20} />
                                  </div>
                                  <Chip size="sm" className="absolute top-2 left-2" color="primary" variant="flat">
                                    Front
                                  </Chip>
                                </div>
                              )}
                              {userData.back_image_link && (
                                <div
                                  className="aspect-video bg-default-100 rounded-lg overflow-hidden cursor-pointer group relative"
                                  onClick={() => handleImageClick(userData.back_image_link!, "Business Card - Back", "Back side")}
                                >
                                  <img
                                    src={userData.back_image_link.startsWith("http") 
                                      ? userData.back_image_link 
                                      : `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:perla-storage/${userData.back_image_link}`}
                                    alt="Back"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <Icon icon="solar:eye-linear" className="text-white opacity-0 group-hover:opacity-100 transition-opacity" width={20} />
                                  </div>
                                  <Chip size="sm" className="absolute top-2 left-2" color="secondary" variant="flat">
                                    Back
                                  </Chip>
                                </div>
                              )}
                              {userData.card_image_url && (
                                <div
                                  className="aspect-video bg-default-100 rounded-lg overflow-hidden cursor-pointer group relative col-span-2"
                                  onClick={() => handleImageClick(userData.card_image_url!, "Business Card", "Full card")}
                                >
                                  <img
                                    src={userData.card_image_url.startsWith("http") 
                                      ? userData.card_image_url 
                                      : `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:perla-storage/${userData.card_image_url}`}
                                    alt="Card"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <Icon icon="solar:eye-linear" className="text-white opacity-0 group-hover:opacity-100 transition-opacity" width={20} />
                                  </div>
                                  <Chip size="sm" className="absolute top-2 left-2" color="success" variant="flat">
                                    Full Card
                                  </Chip>
                                </div>
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      </motion.div>
                    )}

                    {/* Additional Information */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <Card className="shadow-small">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-default-100 flex items-center justify-center">
                              <Icon icon="solar:info-circle-linear" className="text-default-600" width={16} />
                            </div>
                            <h3 className="text-lg font-semibold">Details</h3>
                          </div>
                        </CardHeader>
                        <CardBody className="pt-0 space-y-4">
                          {/* Date Collected */}
                          {userData.date_collected && (
                            <div className="flex items-center gap-3">
                              <Icon icon="solar:calendar-linear" className="text-default-500" width={16} />
                              <div>
                                <p className="text-sm font-medium text-foreground">Date Collected</p>
                                <p className="text-xs text-default-500">
                                  {new Date(userData.date_collected).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Collected At */}
                          {userData.collected_at && userData.collected_at !== userData.date_collected && (
                            <div className="flex items-center gap-3">
                              <Icon icon="solar:clock-circle-linear" className="text-default-500" width={16} />
                              <div>
                                <p className="text-sm font-medium text-foreground">Collected At</p>
                                <p className="text-xs text-default-500">
                                  {new Date(userData.collected_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* OCR Confidence */}
                          {userData.ocr_confidence !== null && userData.ocr_confidence !== undefined && (
                            <div className="flex items-center gap-3">
                              <Icon icon="solar:scanner-linear" className="text-default-500" width={16} />
                              <div className="flex items-center gap-2">
                                <div>
                                  <p className="text-sm font-medium text-foreground">OCR Confidence</p>
                                  <p className="text-xs text-default-500">Text extraction accuracy</p>
                                </div>
                                <Chip 
                                  size="sm" 
                                  variant="flat" 
                                  color={userData.ocr_confidence > 0.8 ? "success" : userData.ocr_confidence > 0.6 ? "warning" : "danger"}
                                >
                                  {(userData.ocr_confidence * 100).toFixed(1)}%
                                </Chip>
                              </div>
                            </div>
                          )}

                          {/* Pool ID */}
                          {userData.pool_id && (
                            <div className="flex items-center gap-3">
                              <Icon icon="solar:database-linear" className="text-default-500" width={16} />
                              <div>
                                <p className="text-sm font-medium text-foreground">Pool</p>
                                <p className="text-xs text-default-500">ID: {userData.pool_id}</p>
                              </div>
                            </div>
                          )}

                          {/* First and Last Name (if different from full name) */}
                          {(userData.first_name || userData.last_name) && 
                           `${userData.first_name || ""} ${userData.last_name || ""}`.trim() !== userData.full_name && (
                            <div className="flex items-center gap-3">
                              <Icon icon="solar:user-id-linear" className="text-default-500" width={16} />
                              <div>
                                <p className="text-sm font-medium text-foreground">Name Components</p>
                                <p className="text-xs text-default-500">
                                  {userData.first_name && `First: ${userData.first_name}`}
                                  {userData.first_name && userData.last_name && " • "}
                                  {userData.last_name && `Last: ${userData.last_name}`}
                                </p>
                              </div>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    </motion.div>

                    {/* Notes */}
                    {userData.notes && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                      >
                        <Card className="shadow-small">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-default-100 flex items-center justify-center">
                                <Icon icon="solar:notes-linear" className="text-default-600" width={16} />
                              </div>
                              <h3 className="text-lg font-semibold">Notes</h3>
                            </div>
                          </CardHeader>
                          <CardBody className="pt-0">
                            <div className="text-sm text-default-700 whitespace-pre-wrap leading-relaxed">
                              {searchTerm ? (
                                <HighlightedText
                                  highlightClassName="bg-yellow-200 text-yellow-900 px-1 rounded-sm font-medium"
                                  searchTerm={searchTerm}
                                  text={userData.notes}
                                />
                              ) : (
                                userData.notes
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      </motion.div>
                    )}

                    {/* Raw OCR Text */}
                    {userData.raw_text && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 }}
                      >
                        <Card className="shadow-small">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center">
                                <Icon icon="solar:document-text-linear" className="text-danger" width={16} />
                              </div>
                              <h3 className="text-lg font-semibold">Raw OCR Text</h3>
                            </div>
                          </CardHeader>
                          <CardBody className="pt-0">
                            <div className="bg-default-100 rounded-lg p-3">
                              <p className="text-xs text-default-600 whitespace-pre-wrap font-mono leading-relaxed">
                                {userData.raw_text}
                              </p>
                            </div>
                          </CardBody>
                        </Card>
                      </motion.div>
                    )}
                  </div>
                </ScrollShadow>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* Clean Image Modal */}
      <Modal
        size="5xl"
        backdrop="opaque"
        isOpen={isImageModalOpen}
        onOpenChange={onImageModalOpenChange}
        classNames={{
          backdrop: "bg-black/90 backdrop-blur-sm",
          base: "bg-transparent shadow-none",
          wrapper: "items-center justify-center p-4",
        }}
      >
        <ModalContent className="bg-transparent shadow-none">
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-between bg-content1/95 backdrop-blur-xl rounded-t-lg">
                <div className="flex items-center gap-3">
                  <Icon icon="solar:gallery-linear" className="text-primary" width={20} />
                  <div>
                    <h3 className="text-lg font-semibold">{selectedImage?.title}</h3>
                    <p className="text-sm text-default-500">Business card image</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    onPress={() => selectedImage && window.open(selectedImage.url, "_blank")}
                  >
                    <Icon icon="solar:external-link-linear" width={16} />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={onClose}
                  >
                    <Icon icon="solar:close-linear" width={16} />
                  </Button>
                </div>
              </ModalHeader>
              <ModalBody className="p-0">
                {selectedImage && (
                  <div className="bg-white rounded-b-lg overflow-hidden">
                    <div className="p-8 bg-gradient-to-br from-default-50 to-default-100 flex items-center justify-center min-h-[400px]">
                      <img
                        src={selectedImage.url}
                        alt={selectedImage.alt}
                        className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}