import React from "react";
import { Card, Button, Image, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";
import { BusinessCardData, emptyBusinessCardData } from "./types";

export interface UploadImageStepProps {
  onImageUpload: (imageData: string, extractedData: BusinessCardData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const UploadImageStep: React.FC<UploadImageStepProps> = ({
  onImageUpload,
  isLoading,
  setIsLoading,
}) => {
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setPreviewImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setPreviewImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!previewImage) return;

    setIsLoading(true);

    try {
      // Simulate API call to extract data from business card
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock response data
      const extractedData: BusinessCardData = {
        full_name: "John Smith",
        email: ["john.smith@example.com"],
        phone_number: ["+1 (555) 123-4567"],
        job_title: "Senior Marketing Manager",
        company_name: "Acme Corporation",
        address: "123 Business Ave, Suite 200",
        website: "www.acmecorp.com",
        linkedin: "linkedin.com/in/johnsmith",
        fax: "+1 (555) 987-6543",
        country: "United States",
        city: "San Francisco",
        raw_text:
          "John Smith\nSenior Marketing Manager\nAcme Corporation\n123 Business Ave, Suite 200\nSan Francisco, CA\nPhone: +1 (555) 123-4567\nFax: +1 (555) 987-6543\nEmail: john.smith@example.com\nwww.acmecorp.com\nlinkedin.com/in/johnsmith",
      };

      onImageUpload(previewImage, extractedData);
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="text-3xl font-bold leading-9 text-default-foreground">
        Upload Business Card
      </div>
      <div className="py-4 text-base leading-5 text-default-500">
        Upload a clear image of a business card to extract contact information
      </div>

      <div className="flex flex-col gap-6 py-8">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <Card
          className={cn(
            "border-2 border-dashed border-default-300 p-8 text-center transition-colors",
            "hover:border-secondary hover:bg-secondary-50 dark:hover:bg-secondary-900/10",
            "cursor-pointer"
          )}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          isPressable={!previewImage}
        >
          {previewImage ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-full max-w-md mx-auto">
                <Image
                  src={previewImage}
                  alt="Business card preview"
                  className="rounded-medium object-contain max-h-[300px] w-full"
                />
                <Button
                  isIconOnly
                  color="danger"
                  variant="flat"
                  size="sm"
                  className="absolute top-2 right-2"
                  onPress={() => setPreviewImage(null)}
                >
                  <Icon icon="lucide:x" width={16} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-12">
              <div className="rounded-full bg-secondary-100 p-4 dark:bg-secondary-900/30">
                <Icon icon="lucide:upload" className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <p className="text-medium font-medium text-default-600">
                  Drag and drop your image here or click to browse
                </p>
                <p className="mt-2 text-small text-default-400">
                  Supports JPG, PNG, JPEG up to 10MB
                </p>
              </div>
            </div>
          )}
        </Card>

        <Button
          color="secondary"
          size="lg"
          className="mx-auto px-8"
          onPress={handleUpload}
          isDisabled={!previewImage || isLoading}
          startContent={isLoading && <Spinner size="sm" color="current" />}
        >
          {isLoading ? "Processing..." : "Extract Information"}
        </Button>
      </div>
    </>
  );
};

export default UploadImageStep;
