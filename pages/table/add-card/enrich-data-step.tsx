import React from "react";
import {
  Card,
  Button,
  Spinner,
  Chip,
  Divider,
  Checkbox,
  Input,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";
import { BusinessCardData, EnrichmentSource, EnrichmentResult } from "./types";

export interface EnrichDataStepProps {
  businessCardData: BusinessCardData;
  setBusinessCardData: (data: BusinessCardData) => void;
}

const EnrichDataStep: React.FC<EnrichDataStepProps> = ({
  businessCardData,
  setBusinessCardData,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEnriched, setIsEnriched] = React.useState(false);
  const [sources, setSources] = React.useState<EnrichmentSource[]>([
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "logos:linkedin-icon",
      selected: true,
    },
    { id: "google", name: "Google", icon: "logos:google-icon", selected: true },
    {
      id: "clearbit",
      name: "Clearbit",
      icon: "lucide:database",
      selected: true,
    },
    {
      id: "hunter",
      name: "Hunter.io",
      icon: "lucide:mail-search",
      selected: false,
    },
  ]);

  const [enrichmentResults, setEnrichmentResults] = React.useState<
    EnrichmentResult[]
  >([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const toggleSource = (id: string) => {
    setSources(
      sources.map((source) =>
        source.id === id ? { ...source, selected: !source.selected } : source
      )
    );
  };

  const startEnrichment = async () => {
    setIsLoading(true);

    try {
      // Simulate API call to enrich data
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock enrichment results
      const mockResults: EnrichmentResult[] = [
        {
          source: "LinkedIn",
          field: "job_title",
          value: "VP of Marketing & Growth",
          selected: true,
        },
        {
          source: "LinkedIn",
          field: "company_name",
          value: "Acme Corporation International",
          selected: true,
        },
        {
          source: "Google",
          field: "website",
          value: "https://www.acmecorp.com",
          selected: true,
        },
        {
          source: "Clearbit",
          field: "email",
          value: "john.smith@acmecorp.com",
          selected: false,
        },
        {
          source: "Clearbit",
          field: "phone_number",
          value: "+1 (555) 123-4567 ext. 890",
          selected: false,
        },
        {
          source: "LinkedIn",
          field: "linkedin",
          value: "https://www.linkedin.com/in/johnsmith-acme",
          selected: true,
        },
      ];

      setEnrichmentResults(mockResults);
      setIsEnriched(true);
    } catch (error) {
      console.error("Error enriching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEnrichmentResult = (index: number) => {
    setEnrichmentResults(
      enrichmentResults.map((result, i) =>
        i === index ? { ...result, selected: !result.selected } : result
      )
    );
  };

  const applySelectedEnrichments = () => {
    const updatedData = { ...businessCardData };

    enrichmentResults.forEach((result) => {
      if (!result.selected) return;

      if (result.field === "email" || result.field === "phone_number") {
        // For array fields, add if not already present
        if (!updatedData[result.field].includes(result.value)) {
          updatedData[result.field] = [
            ...updatedData[result.field],
            result.value,
          ];
        }
      } else {
        // For string fields, replace
        updatedData[result.field] = result.value;
      }
    });

    setBusinessCardData(updatedData);
  };

  const filteredResults = searchQuery
    ? enrichmentResults.filter(
        (result) =>
          result.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.source.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : enrichmentResults;

  return (
    <>
      <div className="text-3xl font-bold leading-9 text-default-foreground">
        Enrich Contact Data
      </div>
      <div className="py-4 text-base leading-5 text-default-500">
        Find additional information from online sources to complete the contact
        profile
      </div>

      <div className="flex flex-col gap-6 py-8">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Select Data Sources</h3>
          <div className="flex flex-wrap gap-3 mb-6">
            {sources.map((source) => (
              <Chip
                key={source.id}
                variant={source.selected ? "flat" : "bordered"}
                color={source.selected ? "secondary" : "default"}
                startContent={<Icon icon={source.icon} className="text-lg" />}
                className="cursor-pointer"
                onClick={() => toggleSource(source.id)}
              >
                {source.name}
              </Chip>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button
              color="secondary"
              size="lg"
              className="w-full sm:w-auto px-8"
              onPress={startEnrichment}
              isDisabled={isLoading || sources.every((s) => !s.selected)}
              startContent={isLoading && <Spinner size="sm" color="current" />}
            >
              {isLoading ? "Searching..." : "Find Additional Information"}
            </Button>

            <p className="text-small text-default-500">
              {sources.filter((s) => s.selected).length} source
              {sources.filter((s) => s.selected).length !== 1 ? "s" : ""}{" "}
              selected
            </p>
          </div>
        </Card>

        {isEnriched && (
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h3 className="text-xl font-semibold">Enrichment Results</h3>

              <Input
                placeholder="Filter results..."
                startContent={
                  <Icon icon="lucide:search" className="text-default-400" />
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64"
                size="sm"
                isClearable
              />
            </div>

            <Divider className="my-4" />

            {filteredResults.length === 0 ? (
              <div className="py-8 text-center text-default-500">
                No results match your filter
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResults.map((result, index) => (
                  <div
                    key={`${result.source}-${result.field}-${index}`}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-medium transition-colors",
                      result.selected
                        ? "bg-secondary-50 dark:bg-secondary-900/20"
                        : "bg-content1"
                    )}
                  >
                    <Checkbox
                      isSelected={result.selected}
                      onValueChange={() => toggleEnrichmentResult(index)}
                      color="secondary"
                    />

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className="font-medium">
                          {result.field.replace("_", " ")}
                        </span>
                        <Chip
                          size="sm"
                          variant="flat"
                          color="default"
                          className="w-fit"
                        >
                          {result.source}
                        </Chip>
                      </div>
                      <p className="text-default-600 mt-1">{result.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Divider className="my-4" />

            <div className="flex justify-end">
              <Button
                color="secondary"
                onPress={applySelectedEnrichments}
                isDisabled={!enrichmentResults.some((r) => r.selected)}
              >
                Apply Selected Changes
              </Button>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default EnrichDataStep;
