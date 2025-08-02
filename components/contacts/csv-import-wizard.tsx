"use client";

import React, { useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Progress,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Select,
  SelectItem,
  Chip,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface CSVImportWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface CSVRow {
  [key: string]: string;
}

interface FieldMapping {
  csvField: string;
  contactField: string;
}

export default function CSVImportWizard({
  onClose,
  onSuccess,
}: CSVImportWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    total: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { id: 1, title: "Upload CSV File", icon: "solar:upload-linear" },
    { id: 2, title: "Map Fields", icon: "solar:settings-linear" },
    { id: 3, title: "Import Contacts", icon: "solar:download-linear" },
  ];

  const contactFields = [
    { key: "full_name", label: "Full Name" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone_number", label: "Phone Number" },
    { key: "company_name", label: "Company Name" },
    { key: "job_title", label: "Job Title" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "country", label: "Country" },
    { key: "website", label: "Website" },
    { key: "linkedin", label: "LinkedIn" },
    { key: "notes", label: "Notes" },
    { key: "skip", label: "Skip This Field" },
  ];

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Please select a CSV file");

      return;
    }

    setCsvFile(file);
    setIsLoading(true);

    // Parse CSV file
    const text = await file.text();
    const lines = text.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      alert("CSV file appears to be empty");
      setIsLoading(false);

      return;
    }

    // Parse headers
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

    setCsvHeaders(headers);

    // Parse data rows (limit to first 5 for preview)
    const dataRows: CSVRow[] = [];

    for (let i = 1; i < Math.min(lines.length, 6); i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));
      const row: CSVRow = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      dataRows.push(row);
    }

    setCsvData(dataRows);

    // Initialize field mappings
    const initialMappings: FieldMapping[] = headers.map((header) => {
      // Auto-suggest mappings based on header names
      const lowerHeader = header.toLowerCase();
      let suggestedField = "skip";

      if (lowerHeader.includes("name") && !lowerHeader.includes("company")) {
        suggestedField = lowerHeader.includes("first")
          ? "first_name"
          : lowerHeader.includes("last")
            ? "last_name"
            : "full_name";
      } else if (lowerHeader.includes("email")) {
        suggestedField = "email";
      } else if (lowerHeader.includes("phone")) {
        suggestedField = "phone_number";
      } else if (lowerHeader.includes("company")) {
        suggestedField = "company_name";
      } else if (
        lowerHeader.includes("title") ||
        lowerHeader.includes("position")
      ) {
        suggestedField = "job_title";
      } else if (lowerHeader.includes("address")) {
        suggestedField = "address";
      } else if (lowerHeader.includes("city")) {
        suggestedField = "city";
      } else if (lowerHeader.includes("state")) {
        suggestedField = "state";
      } else if (lowerHeader.includes("country")) {
        suggestedField = "country";
      } else if (lowerHeader.includes("website")) {
        suggestedField = "website";
      } else if (lowerHeader.includes("linkedin")) {
        suggestedField = "linkedin";
      }

      return {
        csvField: header,
        contactField: suggestedField,
      };
    });

    setFieldMappings(initialMappings);
    setIsLoading(false);
    setCurrentStep(2);
  };

  const handleMappingChange = (csvField: string, contactField: string) => {
    setFieldMappings((prev) =>
      prev.map((mapping) =>
        mapping.csvField === csvField ? { ...mapping, contactField } : mapping,
      ),
    );
  };

  const handleImport = async () => {
    setIsLoading(true);
    setCurrentStep(3);

    // Simulate import process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock import results
    const totalRows = csvData.length * 20; // Simulate more data
    const successCount = Math.floor(totalRows * 0.9);
    const failedCount = totalRows - successCount;

    setImportResults({
      success: successCount,
      failed: failedCount,
      total: totalRows,
    });

    setIsLoading(false);
  };

  const handleFinish = () => {
    onSuccess();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
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
                  icon="solar:upload-linear"
                  width={20}
                />
                <h3 className="text-lg font-semibold">Upload CSV File</h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              <div
                className="border-2 border-dashed border-default-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon
                  className="text-default-400 mx-auto mb-4"
                  icon="solar:cloud-upload-linear"
                  width={48}
                />
                <h4 className="text-lg font-medium text-foreground mb-2">
                  {csvFile ? csvFile.name : "Choose CSV file to upload"}
                </h4>
                <p className="text-default-500">
                  {csvFile
                    ? `${(csvFile.size / 1024).toFixed(1)} KB`
                    : "Click to browse or drag and drop your CSV file here"}
                </p>
                <input
                  ref={fileInputRef}
                  accept=".csv"
                  className="hidden"
                  type="file"
                  onChange={handleFileUpload}
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
                    <p className="font-medium mb-2">CSV File Requirements:</p>
                    <ul className="list-disc list-inside space-y-1 text-tiny">
                      <li>File must have a .csv extension</li>
                      <li>First row should contain column headers</li>
                      <li>Use comma (,) as field separator</li>
                      <li>Maximum file size: 10MB</li>
                      <li>
                        Supported fields: Name, Email, Phone, Company, Title,
                        Address, etc.
                      </li>
                    </ul>
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
                  startContent={<Icon icon="solar:upload-linear" />}
                  onPress={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    className="text-primary"
                    icon="solar:settings-linear"
                    width={20}
                  />
                  <h3 className="text-lg font-semibold">
                    Map CSV Fields to Contact Fields
                  </h3>
                </div>
                <Chip color="primary" size="sm" variant="flat">
                  {csvData.length} preview rows
                </Chip>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="grid gap-4">
                {fieldMappings.map((mapping, index) => (
                  <div
                    key={mapping.csvField}
                    className="flex items-center gap-4 p-3 bg-default-50 dark:bg-default-100/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {mapping.csvField}
                      </p>
                      <p className="text-small text-default-500">
                        Sample: {csvData[0]?.[mapping.csvField] || "No data"}
                      </p>
                    </div>
                    <Icon
                      className="text-default-400"
                      icon="solar:arrow-right-linear"
                      width={20}
                    />
                    <div className="flex-1">
                      <Select
                        selectedKeys={[mapping.contactField]}
                        size="sm"
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;

                          handleMappingChange(mapping.csvField, selectedKey);
                        }}
                      >
                        {contactFields.map((field) => (
                          <SelectItem key={field.key} value={field.key}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                ))}
              </div>

              <Divider />

              <div>
                <h4 className="font-semibold mb-3">Preview (First 5 rows)</h4>
                <div className="overflow-x-auto">
                  <Table aria-label="CSV Preview">
                    <TableHeader>
                      {csvHeaders.map((header) => (
                        <TableColumn key={header}>{header}</TableColumn>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {csvData.map((row, index) => (
                        <TableRow key={index}>
                          {csvHeaders.map((header) => (
                            <TableCell key={header}>
                              {row[header] || "-"}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                  startContent={<Icon icon="solar:download-linear" />}
                  onPress={handleImport}
                >
                  Start Import
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon
                  className="text-primary"
                  icon="solar:download-linear"
                  width={20}
                />
                <h3 className="text-lg font-semibold">Import Progress</h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-4">
                    <Icon
                      className="text-primary animate-spin"
                      icon="solar:refresh-linear"
                      width={32}
                    />
                  </div>
                  <h4 className="font-semibold mb-2">Importing Contacts...</h4>
                  <p className="text-default-500">
                    Please wait while we process your CSV file
                  </p>
                  <Progress isIndeterminate className="mt-4" color="primary" />
                </div>
              ) : importResults ? (
                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-success/10 mx-auto mb-4">
                    <Icon
                      className="text-success"
                      icon="solar:check-circle-linear"
                      width={32}
                    />
                  </div>
                  <h4 className="text-xl font-semibold mb-4">
                    Import Complete!
                  </h4>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardBody className="text-center p-4">
                        <div className="text-2xl font-bold text-success mb-1">
                          {importResults.success}
                        </div>
                        <div className="text-small text-default-500">
                          Successful
                        </div>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody className="text-center p-4">
                        <div className="text-2xl font-bold text-danger mb-1">
                          {importResults.failed}
                        </div>
                        <div className="text-small text-default-500">
                          Failed
                        </div>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody className="text-center p-4">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {importResults.total}
                        </div>
                        <div className="text-small text-default-500">Total</div>
                      </CardBody>
                    </Card>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      color="success"
                      size="lg"
                      startContent={<Icon icon="solar:check-circle-linear" />}
                      onPress={handleFinish}
                    >
                      Finish Import
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardBody>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
