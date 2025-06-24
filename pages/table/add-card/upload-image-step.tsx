import React from "react";
import { Card, Button, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

import { BusinessCardData } from "../../../types/types";

import { extractBusinessCardData } from "@/config/api";

export interface UploadImageStepProps {
  onImageUpload: (
    frontImage: string,
    backImage: string | null,
    extractedData: BusinessCardData,
  ) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onNextStep: () => void;
}

const UploadImageStep: React.FC<UploadImageStepProps> = ({
  onImageUpload,
  isLoading,
  setIsLoading,
  onNextStep,
}) => {
  const [frontImage, setFrontImage] = React.useState<string | null>(null);
  const [backImage, setBackImage] = React.useState<string | null>(null);
  const [frontFile, setFrontFile] = React.useState<File | null>(null);
  const [backFile, setBackFile] = React.useState<File | null>(null);

  const frontInputRef = React.useRef<HTMLInputElement>(null);
  const backInputRef = React.useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPG, JPEG, or PNG)");

      return false;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes

    if (file.size > maxSize) {
      alert("File size must be less than 10MB");

      return false;
    }

    return true;
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back",
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!validateFile(file)) return;

    if (side === "front") {
      setFrontFile(file);
    } else {
      setBackFile(file);
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const imageData = e.target?.result as string;

      if (side === "front") {
        setFrontImage(imageData);
      } else {
        setBackImage(imageData);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    side: "front" | "back",
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    if (!validateFile(file)) return;

    if (side === "front") {
      setFrontFile(file);
    } else {
      setBackFile(file);
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const imageData = e.target?.result as string;

      if (side === "front") {
        setFrontImage(imageData);
      } else {
        setBackImage(imageData);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!frontImage || !frontFile) return;

    setIsLoading(true);

    try {
      // Call the OCR API with the front side image
      const extractedData = await extractBusinessCardData(
        frontFile,
        backFile ?? undefined,
      );

      // Pass both images and the extracted data to parent component
      onImageUpload(frontImage, backImage, extractedData);
      onNextStep();
    } catch (error: any) {
      console.error("Error processing image:", error);

      // More detailed error handling
      let errorMessage = "Failed to process business card. Please try again.";

      if (error.response) {
        // Server responded with error status
        errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || "Unknown error"}`;
      } else if (error.request) {
        // Network error
        errorMessage =
          "Network error. Please check if the server is running on localhost:5000";
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = (side: "front" | "back") => {
    if (side === "front") {
      frontInputRef.current?.click();
    } else {
      backInputRef.current?.click();
    }
  };

  const removeImage = (side: "front" | "back") => {
    if (side === "front") {
      setFrontImage(null);
      setFrontFile(null);
      if (frontInputRef.current) {
        frontInputRef.current.value = "";
      }
    } else {
      setBackImage(null);
      setBackFile(null);
      if (backInputRef.current) {
        backInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <div className="text-3xl font-bold leading-9 text-default-foreground">
        Upload Document
      </div>
      <div className="py-4 text-base leading-5 text-default-500">
        Upload the front and back sides of your document
      </div>

      <div className="flex flex-col gap-6 py-8">
        <input
          ref={frontInputRef}
          accept="image/jpeg,image/jpg,image/png"
          capture="environment"
          className="hidden"
          type="file"
          onChange={(e) => handleFileChange(e, "front")}
        />

        <input
          ref={backInputRef}
          accept="image/jpeg,image/jpg,image/png"
          capture="environment"
          className="hidden"
          type="file"
          onChange={(e) => handleFileChange(e, "back")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Front Side Upload */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-medium font-semibold">Front Side</h3>
              <div className="flex items-center">
                <span className="text-tiny text-success-500 mr-2">
                  {frontImage ? "Uploaded" : "Required"}
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${frontImage ? "bg-success-500" : "bg-danger-500"}`}
                />
              </div>
            </div>

            <Card
              className={cn(
                "border-2 border-dashed border-default-300 p-4 text-center transition-colors",
                "hover:border-secondary hover:bg-secondary-50 dark:hover:bg-secondary-900/10",
                "cursor-pointer",
              )}
              isPressable={!frontImage}
              onClick={() => triggerFileInput("front")}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "front")}
            >
              {frontImage ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-full">
                    <Image
                      alt="Front side preview"
                      className="rounded-medium object-contain max-h-[200px] w-full"
                      src={frontImage}
                    />
                    <Button
                      isIconOnly
                      className="absolute top-2 right-2"
                      color="danger"
                      size="sm"
                      variant="flat"
                      onPress={() => removeImage("front")}
                    >
                      <Icon icon="lucide:x" width={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="rounded-full bg-secondary-100 p-3 dark:bg-secondary-900/30">
                    <Icon
                      className="h-6 w-6 text-secondary"
                      icon="lucide:upload"
                    />
                  </div>
                  <div>
                    <p className="text-small font-medium text-default-600">
                      Upload front side
                    </p>
                    <p className="mt-1 text-tiny text-default-400">
                      Click or drag & drop
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Back Side Upload */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-medium font-semibold">Back Side</h3>
              <div className="flex items-center">
                <span className="text-tiny text-default-500 mr-2">
                  {backImage ? "Uploaded" : "Optional"}
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${backImage ? "bg-success-500" : "bg-default-300"}`}
                />
              </div>
            </div>

            <Card
              className={cn(
                "border-2 border-dashed border-default-300 p-4 text-center transition-colors",
                "hover:border-secondary hover:bg-secondary-50 dark:hover:bg-secondary-900/10",
                "cursor-pointer",
              )}
              isPressable={!backImage}
              onClick={() => triggerFileInput("back")}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "back")}
            >
              {backImage ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-full">
                    <Image
                      alt="Back side preview"
                      className="rounded-medium object-contain max-h-[200px] w-full"
                      src={backImage}
                    />
                    <Button
                      isIconOnly
                      className="absolute top-2 right-2"
                      color="danger"
                      size="sm"
                      variant="flat"
                      onPress={() => removeImage("back")}
                    >
                      <Icon icon="lucide:x" width={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="rounded-full bg-default-100 p-3 dark:bg-default-100/30">
                    <Icon
                      className="h-6 w-6 text-default-500"
                      icon="lucide:upload"
                    />
                  </div>
                  <div>
                    <p className="text-small font-medium text-default-600">
                      Upload back side
                    </p>
                    <p className="mt-1 text-tiny text-default-400">
                      Click or drag & drop
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <Button
            className="mx-auto"
            color="primary"
            isDisabled={!frontImage || isLoading}
            isLoading={isLoading}
            startContent={!isLoading && <Icon icon="lucide:scan-text" />}
            onPress={handleUpload}
          >
            {isLoading ? "Processing..." : "Extract Information"}
          </Button>

          <p className="text-center text-tiny text-default-400">
            {frontImage ? "Front side uploaded" : "Front side required"} •
            {backImage ? " Back side uploaded" : " Back side optional"}
          </p>
        </div>
      </div>
    </>
  );
};

export default UploadImageStep;
