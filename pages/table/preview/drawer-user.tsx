import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  Link,
  Tooltip,
  Avatar,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export default function DrawerCustomStyles() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const userData = {
    id: "f0e29811-c965-43da-91af-f146357ef3a5",
    full_name: "Arturo Maravigna",
    job_title: "CEO",
    company_name: "SEOS",
    website: "www.gamastech.com",
    address: "Via Giovanni Verga 27, 95030 Sant'Agata Li Battisti (CT) - Italy",
    city: "Sant'Agata Li Battisti",
    country: "Italy",
    email: ["arturo.maravigna@gamastech.com", ""],
    phone_number: ["+393473871836", ""],
    gender: "male",
  };

  return (
    <>
      <Button
        color="primary"
        endContent={<Icon height={16} icon="lucide:user" width={16} />}
        variant="flat"
        onPress={onOpen}
      >
        View Contact
      </Button>
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
          {(onClose: any) => (
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
                  >
                    Copy Contact
                  </Button>
                  <Button
                    className="font-medium text-small text-default-500"
                    endContent={
                      <Icon
                        height={16}
                        icon="lucide:external-link"
                        width={16}
                      />
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
                      src={`https://img.heroui.chat/image/avatar?w=200&h=200&u=${userData.id}`}
                    />
                    <div>
                      <h1 className="text-2xl font-bold leading-7">
                        {userData.full_name}
                      </h1>
                      <p className="text-small text-default-500">
                        {userData.job_title} at {userData.company_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3 items-center">
                      <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-11 h-11">
                        <Icon
                          className="text-default-500"
                          height={20}
                          icon="lucide:mail"
                          width={20}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <Link
                          isExternal
                          showAnchorIcon
                          className="text-medium text-foreground font-medium"
                          href={`mailto:${userData.email[0]}`}
                        >
                          {userData.email[0]}
                        </Link>
                        <p className="text-small text-default-500">Email</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-11 h-11">
                        <Icon
                          className="text-default-500"
                          height={20}
                          icon="lucide:phone"
                          width={20}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 flex-1">
                        <div className="flex flex-col gap-0.5 flex-1">
                          <Link
                            isExternal
                            showAnchorIcon
                            className="text-medium text-foreground font-medium"
                            href={`tel:${userData.phone_number[0]}`}
                          >
                            {userData.phone_number[0]}
                          </Link>
                          <p className="text-small text-default-500">Phone</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tooltip content="Open WhatsApp chat">
                            <Button
                              isIconOnly
                              className="h-6 w-6 min-w-6 text-success-500 hover:text-success-600"
                              size="sm"
                              variant="light"
                              onPress={() => {
                                const cleanPhone =
                                  userData.phone_number[0].replace(
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
                              className="h-6 w-6 min-w-6 text-default-400 hover:text-primary"
                              size="sm"
                              variant="light"
                              onPress={() => {
                                navigator.clipboard.writeText(
                                  userData.phone_number[0],
                                );
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
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-11 h-11">
                        <Icon
                          className="text-default-500"
                          height={20}
                          icon="lucide:globe"
                          width={20}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <Link
                          isExternal
                          showAnchorIcon
                          className="text-medium text-foreground font-medium"
                          href={`https://${userData.website}`}
                        >
                          {userData.website}
                        </Link>
                        <p className="text-small text-default-500">Website</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-11 h-11">
                        <Icon
                          className="text-default-500"
                          height={20}
                          icon="lucide:map-pin"
                          width={20}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-medium text-foreground font-medium">
                          {userData.address}
                        </p>
                        <p className="text-small text-default-500">
                          {userData.city}, {userData.country}
                        </p>
                      </div>
                    </div>
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
    </>
  );
}
