import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface BusinessCardData {
  full_name: string;
  email: string[];
  phone_number: string[];
  job_title: string;
  company_name: string;
  address: string;
  website: string;
  linkedin: string;
  country: string;
  country_code: string | null;
  city: string;
  raw_text: string;
  notes: string;
  gender: boolean | null; // true = male, false = female, null = unknown
  pool_id: string | null;
}

export const emptyBusinessCardData: BusinessCardData = {
  full_name: "",
  email: [""],
  phone_number: [""],
  job_title: "",
  company_name: "",
  address: "",
  website: "",
  linkedin: "",
  country: "",
  country_code: null,
  city: "",
  raw_text: "",
  notes: "",
  gender: null,
  pool_id: null,
};

export interface EnrichmentSource {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

export interface EnrichmentResult {
  source: string;
  field: keyof BusinessCardData;
  value: string;
  selected: boolean;
}
