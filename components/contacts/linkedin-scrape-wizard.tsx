"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Divider,
  Avatar,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { Users } from "@/types/data";

interface LinkedInScrapeWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface LinkedInProfile {
  name: string;
  headline: string;
  location: string;
  avatar: string;
  company: string;
  experience: string;
  connections: string;
  about: string;
}

export default function LinkedInScrapeWizard({
  onClose,
  onSuccess,
}: LinkedInScrapeWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedProfile, setScrapedProfile] = useState<LinkedInProfile | null>(
    null,
  );
  const [extractedContact, setExtractedContact] =
    useState<Partial<Users> | null>(null);

  const steps = [
    { id: 1, title: "Enter LinkedIn URL", icon: "solar:link-linear" },
    { id: 2, title: "Profile Analysis", icon: "solar:eye-linear" },
    { id: 3, title: "Review & Save", icon: "solar:check-circle-linear" },
  ];

  const handleUrlSubmit = async () => {
    if (!linkedinUrl.trim()) return;

    setIsLoading(true);

    // Simulate LinkedIn scraping
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock scraped data
    const mockProfile: LinkedInProfile = {
      name: "John Smith",
      headline: "Senior Software Engineer at TechCorp",
      location: "San Francisco, California",
      avatar: "https://i.pravatar.cc/150?u=johnsmith",
      company: "TechCorp Inc.",
      experience: "5+ years",
      connections: "500+ connections",
      about:
        "Passionate software engineer with expertise in full-stack development, cloud architecture, and team leadership.",
    };

    setScrapedProfile(mockProfile);
    setIsLoading(false);
    setCurrentStep(2);
  };

  const handleProfileReview = () => {
    if (!scrapedProfile) return;

    // Convert scraped profile to contact format
    const contact: Partial<Users> = {
      full_name: scrapedProfile.name,
      first_name: scrapedProfile.name.split(" ")[0],
      last_name: scrapedProfile.name.split(" ").slice(1).join(" "),
      job_title: scrapedProfile.headline.split(" at ")[0],
      company_name: scrapedProfile.company,
      linkedin: linkedinUrl,
      notes: scrapedProfile.about,
      source: "LinkedIn Import",
      // Parse location for country/city
      city: scrapedProfile.location.split(",")[0],
      state: scrapedProfile.location.split(",")[1]?.trim(),
      country: "United States", // Could be parsed better
    };

    setExtractedContact(contact);
    setCurrentStep(3);
  };

  const handleSaveContact = async () => {
    setIsLoading(true);

    // Simulate API call to save contact
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Saving LinkedIn contact:", extractedContact);

    setIsLoading(false);
    onSuccess();
  };

  const isValidLinkedInUrl = (url: string) => {
    return (
      url.includes("linkedin.com/in/") || url.includes("linkedin.com/pub/")
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    currentStep >= step.id
                      ? "bg-primary border-primary text-white shadow-lg"
                      : currentStep === step.id - 1
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-default-50 border-default-200 text-default-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Icon icon="solar:check-circle-bold" width={20} />
                  ) : (
                    <span className="text-medium font-semibold">{step.id}</span>
                  )}
                </div>
                <span
                  className={`text-small font-medium text-center max-w-[80px] ${
                    currentStep >= step.id
                      ? "text-foreground"
                      : "text-default-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-16 mx-4 mt-[-20px] transition-colors duration-200 ${
                    currentStep > step.id ? "bg-primary" : "bg-default-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        initial={{ opacity: 0, x: 20 }}
      >
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon
                  className="text-primary"
                  icon="solar:link-linear"
                  width={20}
                />
                <h3 className="text-lg font-semibold">
                  Enter LinkedIn Profile URL
                </h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              <div>
                <Input
                  errorMessage={
                    linkedinUrl.length > 0 && !isValidLinkedInUrl(linkedinUrl)
                      ? "Please enter a valid LinkedIn profile URL"
                      : ""
                  }
                  isInvalid={
                    linkedinUrl.length > 0 && !isValidLinkedInUrl(linkedinUrl)
                  }
                  label="LinkedIn Profile URL"
                  placeholder="https://www.linkedin.com/in/john-smith"
                  startContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:link-linear"
                    />
                  }
                  value={linkedinUrl}
                  onValueChange={setLinkedinUrl}
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon
                    className="text-blue-600 mt-0.5"
                    icon="solar:info-circle-linear"
                    width={20}
                  />
                  <div className="text-small text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-2">
                      How to find a LinkedIn profile URL:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-tiny">
                      <li>Go to the person's LinkedIn profile</li>
                      <li>Look for the URL in your browser's address bar</li>
                      <li>
                        Copy the entire URL (e.g.,
                        https://www.linkedin.com/in/john-smith)
                      </li>
                      <li>Make sure the profile is publicly accessible</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  startContent={<Icon icon="solar:close-circle-linear" />}
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isDisabled={
                    !linkedinUrl.trim() || !isValidLinkedInUrl(linkedinUrl)
                  }
                  isLoading={isLoading}
                  startContent={
                    !isLoading ? <Icon icon="solar:eye-linear" /> : undefined
                  }
                  onPress={handleUrlSubmit}
                >
                  {isLoading ? "Analyzing Profile..." : "Analyze Profile"}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {currentStep === 2 && scrapedProfile && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon
                  className="text-primary"
                  icon="solar:eye-linear"
                  width={20}
                />
                <h3 className="text-lg font-semibold">
                  Profile Analysis Results
                </h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <Avatar size="lg" src={scrapedProfile.avatar} />
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-foreground">
                    {scrapedProfile.name}
                  </h4>
                  <p className="text-default-600 mb-2">
                    {scrapedProfile.headline}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Chip
                      size="sm"
                      startContent={
                        <Icon icon="solar:map-point-linear" width={14} />
                      }
                      variant="flat"
                    >
                      {scrapedProfile.location}
                    </Chip>
                    <Chip
                      size="sm"
                      startContent={
                        <Icon
                          icon="solar:users-group-rounded-linear"
                          width={14}
                        />
                      }
                      variant="flat"
                    >
                      {scrapedProfile.connections}
                    </Chip>
                    <Chip
                      size="sm"
                      startContent={
                        <Icon icon="solar:case-linear" width={14} />
                      }
                      variant="flat"
                    >
                      {scrapedProfile.experience}
                    </Chip>
                  </div>
                  <p className="text-small text-default-500">
                    {scrapedProfile.about}
                  </p>
                </div>
              </div>

              <Divider />

              <div>
                <h5 className="font-semibold mb-3">Extracted Information:</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-small text-default-500">Name</p>
                    <p className="font-medium">{scrapedProfile.name}</p>
                  </div>
                  <div>
                    <p className="text-small text-default-500">Company</p>
                    <p className="font-medium">{scrapedProfile.company}</p>
                  </div>
                  <div>
                    <p className="text-small text-default-500">Job Title</p>
                    <p className="font-medium">
                      {scrapedProfile.headline.split(" at ")[0]}
                    </p>
                  </div>
                  <div>
                    <p className="text-small text-default-500">Location</p>
                    <p className="font-medium">{scrapedProfile.location}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  startContent={<Icon icon="solar:arrow-left-linear" />}
                  variant="light"
                  onPress={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button
                  color="primary"
                  startContent={<Icon icon="solar:check-circle-linear" />}
                  onPress={handleProfileReview}
                >
                  Continue to Review
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {currentStep === 3 && extractedContact && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon
                  className="text-primary"
                  icon="solar:check-circle-linear"
                  width={20}
                />
                <h3 className="text-lg font-semibold">Review & Save Contact</h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={extractedContact.full_name || ""}
                  onValueChange={(value) =>
                    setExtractedContact((prev) =>
                      prev ? { ...prev, full_name: value } : null,
                    )
                  }
                />
                <Input
                  label="Job Title"
                  value={extractedContact.job_title || ""}
                  onValueChange={(value) =>
                    setExtractedContact((prev) =>
                      prev ? { ...prev, job_title: value } : null,
                    )
                  }
                />
                <Input
                  label="Company"
                  value={extractedContact.company_name || ""}
                  onValueChange={(value) =>
                    setExtractedContact((prev) =>
                      prev ? { ...prev, company_name: value } : null,
                    )
                  }
                />
                <Input
                  label="LinkedIn URL"
                  value={extractedContact.linkedin || ""}
                  onValueChange={(value) =>
                    setExtractedContact((prev) =>
                      prev ? { ...prev, linkedin: value } : null,
                    )
                  }
                />
                <Input
                  label="City"
                  value={extractedContact.city || ""}
                  onValueChange={(value) =>
                    setExtractedContact((prev) =>
                      prev ? { ...prev, city: value } : null,
                    )
                  }
                />
                <Input
                  label="Country"
                  value={extractedContact.country || ""}
                  onValueChange={(value) =>
                    setExtractedContact((prev) =>
                      prev ? { ...prev, country: value } : null,
                    )
                  }
                />
              </div>

              <div>
                <Input
                  label="Notes"
                  placeholder="Additional notes about this contact..."
                  value={extractedContact.notes || ""}
                  onValueChange={(value) =>
                    setExtractedContact((prev) =>
                      prev ? { ...prev, notes: value } : null,
                    )
                  }
                />
              </div>

              <div className="flex justify-between">
                <Button
                  startContent={<Icon icon="solar:arrow-left-linear" />}
                  variant="light"
                  onPress={() => setCurrentStep(2)}
                >
                  Back
                </Button>
                <Button
                  color="success"
                  isLoading={isLoading}
                  startContent={
                    !isLoading ? (
                      <Icon icon="solar:diskette-linear" />
                    ) : undefined
                  }
                  onPress={handleSaveContact}
                >
                  {isLoading ? "Saving..." : "Save Contact"}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
