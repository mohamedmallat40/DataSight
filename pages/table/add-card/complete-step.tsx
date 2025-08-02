import React from "react";
import { Card, Button, Image, Divider, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

import { BusinessCardData } from "../../../types/types";

export interface CompleteStepProps {
  businessCardData: BusinessCardData;
  uploadedImage: string | null;
}

const CompleteStep: React.FC<CompleteStepProps> = ({
  businessCardData,
  uploadedImage,
}) => {
  const handleExport = () => {
    // Create a JSON blob and trigger download
    const dataStr = JSON.stringify(businessCardData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `contact-${businessCardData.full_name?.replace(/\s+/g, "-").toLowerCase() || "unknown"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="text-3xl font-bold leading-9 text-default-foreground">
        Contact Information Complete
      </div>
      <div className="py-4 text-base leading-5 text-default-500">
        Your contact information has been successfully processed
      </div>

      <div className="flex flex-col gap-6 py-8">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {uploadedImage && (
              <div className="md:w-1/3">
                <Image
                  alt="Business card"
                  className="rounded-medium object-contain w-full max-h-[200px]"
                  src={uploadedImage}
                />
              </div>
            )}

            <div className={uploadedImage ? "md:w-2/3" : "w-full"}>
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">
                  {businessCardData?.full_name || "Unknown"}
                </h2>
                <p className="text-default-500">
                  {businessCardData?.job_title || ""}
                </p>
                <p className="font-medium">
                  {businessCardData?.company_name || ""}
                </p>
              </div>

              <Divider className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-medium font-semibold">Contact Details</h3>

                  {businessCardData?.email?.map((email, index) => (
                    <div
                      key={`email-${index}`}
                      className="flex items-center gap-2"
                    >
                      <Icon className="text-default-400" icon="lucide:mail" />
                      <span>{email}</span>
                    </div>
                  ))}

                  {businessCardData?.phone_number?.map((phone, index) => (
                    <div
                      key={`phone-${index}`}
                      className="flex items-center gap-2"
                    >
                      <Icon className="text-default-400" icon="lucide:phone" />
                      <span>{phone}</span>
                    </div>
                  ))}

                  <div className="space-y-3">
                    <h3 className="text-medium font-semibold">
                      Online Presence
                    </h3>

                    {businessCardData?.website && (
                      <div className="flex items-center gap-2">
                        <Icon
                          className="text-default-400"
                          icon="lucide:globe"
                        />
                        <span>{businessCardData?.website}</span>
                      </div>
                    )}

                    {businessCardData?.linkedin && (
                      <div className="flex items-center gap-2">
                        <Icon
                          className="text-default-400"
                          icon="lucide:linkedin"
                        />
                        <span>{businessCardData?.linkedin}</span>
                      </div>
                    )}

                    <h3 className="text-medium font-semibold mt-4">Location</h3>

                    {businessCardData?.address && (
                      <div className="flex items-center gap-2">
                        <Icon
                          className="text-default-400"
                          icon="lucide:map-pin"
                        />
                        <span>{businessCardData?.address}</span>
                      </div>
                    )}

                    {(businessCardData?.city || businessCardData?.country) && (
                      <div className="flex items-center gap-2">
                        <Icon className="text-default-400" icon="lucide:map" />
                        <span>
                          {[businessCardData?.city, businessCardData?.country]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Divider className="my-6" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2">
              <Chip
                color="success"
                startContent={<Icon icon="lucide:check" />}
                variant="flat"
              >
                Processing Complete
              </Chip>
            </div>

            <div className="flex gap-3">
              <Button
                color="default"
                startContent={<Icon icon="lucide:copy" />}
                variant="flat"
                onPress={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify(businessCardData, null, 2),
                  )
                }
              >
                Copy JSON
              </Button>

              <Button
                color="secondary"
                startContent={<Icon icon="lucide:download" />}
                onPress={handleExport}
              >
                Export Contact
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default CompleteStep;
