export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  avatar?: string;
  country?: string;
  countryCode?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  source: "manual" | "ocr" | "import";
  ocrData?: OCRData;
}

export interface OCRData {
  originalImage: string;
  confidence: number;
  extractedFields: {
    name: { value: string; confidence: number };
    email: { value: string; confidence: number };
    phone: { value: string; confidence: number };
    company: { value: string; confidence: number };
    jobTitle: { value: string; confidence: number };
  };
  processedAt: string;
}

export interface ContactFilters {
  search?: string;
  country?: string;
  tags?: string[];
  source?: Contact["source"];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ContactsResponse {
  contacts: Contact[];
  total: number;
  page: number;
  pageSize: number;
}
