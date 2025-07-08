"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Chip,
  Divider,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import DefaultLayout from "@/layouts/default";
import {
  checkEmailReachability,
  checkWebsiteReachability,
  getReachabilityColor,
} from "@/utils/reachability";
import type { ReachabilityResult } from "@/utils/reachability";
import { WebsitePreview } from "@/components/table/website-preview";

export default function ReachabilityTestPage(): JSX.Element {
  const [emailInput, setEmailInput] = useState("lokaa@gmail.com");
  const [websiteInput, setWebsiteInput] = useState("https://perla-ssssit.com");
  const [emailResult, setEmailResult] = useState<ReachabilityResult | null>(
    null,
  );
  const [websiteResult, setWebsiteResult] = useState<ReachabilityResult | null>(
    null,
  );
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingWebsite, setIsCheckingWebsite] = useState(false);

  const handleCheckEmail = async () => {
    if (!emailInput.trim()) return;

    setIsCheckingEmail(true);
    setEmailResult(null);

    try {
      const result = await checkEmailReachability(emailInput.trim());
      setEmailResult(result);
    } catch (error) {
      console.error("Error checking email:", error);
      setEmailResult({
        status: "unknown",
        checkedAt: new Date(),
      });
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleCheckWebsite = async () => {
    if (!websiteInput.trim()) return;

    setIsCheckingWebsite(true);
    setWebsiteResult(null);

    try {
      const result = await checkWebsiteReachability(websiteInput.trim());
      setWebsiteResult(result);
    } catch (error) {
      console.error("Error checking website:", error);
      setWebsiteResult({
        status: "unknown",
        checkedAt: new Date(),
      });
    } finally {
      setIsCheckingWebsite(false);
    }
  };

  const renderResult = (
    result: ReachabilityResult | null,
    isChecking: boolean,
  ) => {
    if (isChecking) {
      return (
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          <span className="text-sm text-gray-600">Checking...</span>
        </div>
      );
    }

    if (!result) return null;

    const { color, text, icon } = getReachabilityColor(result.status);

    return (
      <div className="flex items-center gap-2">
        <Chip
          color={color}
          variant="flat"
          startContent={<Icon icon={icon} className="w-4 h-4" />}
        >
          {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
          {text && ` - ${text}`}
        </Chip>
        <span className="text-xs text-gray-500">
          Checked at {result.checkedAt.toLocaleTimeString()}
        </span>
      </div>
    );
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className="text-3xl font-bold">Reachability Testing</h1>
          <p className="text-lg text-gray-600 mt-2">
            Test the new API endpoints for email and website reachability
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-2xl">
          {/* Email Testing Card */}
          <Card className="w-full">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <Icon icon="solar:letter-outline" className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Email Reachability</h2>
              </div>
              <p className="text-sm text-gray-600">
                Uses endpoint:{" "}
                <code className="bg-gray-100 px-1 rounded">
                  /is-email-alive?email=
                </code>
              </p>
            </CardHeader>
            <CardBody className="pt-2">
              <div className="flex flex-col gap-4">
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="Enter email to test"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCheckEmail()}
                />
                <div className="flex justify-between items-center">
                  <Button
                    color="primary"
                    onPress={handleCheckEmail}
                    isDisabled={!emailInput.trim() || isCheckingEmail}
                    isLoading={isCheckingEmail}
                  >
                    Check Email
                  </Button>
                  {renderResult(emailResult, isCheckingEmail)}
                </div>
              </div>
            </CardBody>
          </Card>

          <Divider />

          {/* Website Testing Card */}
          <Card className="w-full">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <Icon icon="solar:global-outline" className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Website Reachability</h2>
              </div>
              <p className="text-sm text-gray-600">
                Uses endpoint:{" "}
                <code className="bg-gray-100 px-1 rounded">
                  /is-website-reachable?url=
                </code>
              </p>
            </CardHeader>
            <CardBody className="pt-2">
              <div className="flex flex-col gap-4">
                <Input
                  type="url"
                  label="Website URL"
                  placeholder="Enter website URL to test"
                  value={websiteInput}
                  onChange={(e) => setWebsiteInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCheckWebsite()}
                />
                <div className="flex justify-between items-center">
                  <Button
                    color="primary"
                    onPress={handleCheckWebsite}
                    isDisabled={!websiteInput.trim() || isCheckingWebsite}
                    isLoading={isCheckingWebsite}
                  >
                    Check Website
                  </Button>
                  {renderResult(websiteResult, isCheckingWebsite)}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Website Preview Demo */}
          <Card className="w-full">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <Icon icon="solar:eye-outline" className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Website Preview</h2>
              </div>
              <p className="text-sm text-gray-600">
                Hover over website links to see live previews
              </p>
            </CardHeader>
            <CardBody className="pt-2">
              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600">
                  Hover over any of these website links to see the preview
                  functionality:
                </p>
                <div className="flex flex-wrap gap-4">
                  <WebsitePreview url="https://perla-it.com">
                    <Chip
                      as="button"
                      color="primary"
                      variant="bordered"
                      className="cursor-pointer hover:bg-primary/10"
                    >
                      perla-it.com
                    </Chip>
                  </WebsitePreview>

                  <WebsitePreview url="https://google.com">
                    <Chip
                      as="button"
                      color="secondary"
                      variant="bordered"
                      className="cursor-pointer hover:bg-secondary/10"
                    >
                      google.com
                    </Chip>
                  </WebsitePreview>

                  <WebsitePreview url="github.com">
                    <Chip
                      as="button"
                      color="success"
                      variant="bordered"
                      className="cursor-pointer hover:bg-success/10"
                    >
                      github.com
                    </Chip>
                  </WebsitePreview>
                </div>
                <div className="text-xs text-gray-500">
                  <p>• Hover shows preview with 300ms delay</p>
                  <p>
                    • Uses endpoint:{" "}
                    <code>/preview-website?url=https://example.com</code>
                  </p>
                  <p>• Includes loading spinner while generating image</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* API Information Card */}
          <Card className="w-full">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <Icon icon="solar:info-circle-outline" className="w-5 h-5" />
                <h2 className="text-xl font-semibold">API Integration</h2>
              </div>
            </CardHeader>
            <CardBody className="pt-2">
              <div className="flex flex-col gap-3 text-sm">
                <div>
                  <strong>Email Endpoint:</strong>
                  <code className="block bg-gray-100 p-2 rounded mt-1">
                    GET /is-email-alive?email=lokaa@gmail.com
                  </code>
                </div>
                <div>
                  <strong>Website Endpoint:</strong>
                  <code className="block bg-gray-100 p-2 rounded mt-1">
                    GET /is-website-reachable?url=https://perla-ssssit.com
                  </code>
                </div>
                <div className="text-gray-600">
                  <p>
                    • Both endpoints are now integrated into the existing
                    reachability system
                  </p>
                  <p>
                    • Results are cached for 5 minutes to improve performance
                  </p>
                  <p>
                    • Automatic fallback to browser-based checking if API fails
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
