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
  city: string;
  raw_text: string;
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
  city: "",
  raw_text: "",
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
