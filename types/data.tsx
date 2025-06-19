import { DangerCircleSvg } from "../components/table/danger-circle";
import { DefaultCircleSvg } from "../components/table/default-circle";
import { SuccessCircleSvg } from "../components/table/success-cirecle";
import { WarningCircleSvg } from "../components/table/warning-circle";

// ===============================
// 🟢 Status Options
// ===============================

export const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Inactive", uid: "inactive" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
] as const;

export type StatusOptions = (typeof statusOptions)[number]["name"];

export const statusColorMap: Record<StatusOptions, JSX.Element> = {
  Active: <SuccessCircleSvg />,
  Inactive: <DefaultCircleSvg />,
  Paused: <DangerCircleSvg />,
  Vacation: <WarningCircleSvg />,
};

// ===============================
// 🟢 Team Types (optional)
export type Teams =
  | "Design"
  | "Product"
  | "Marketing"
  | "Management"
  | "Engineering"
  | "Sales"
  | "Support"
  | "Other"
  | (string & {}); // fallback for unknown team strings

// ===============================
// 🟢 User Types
// ===============================

export type MemberInfo = {
  avatar: string;
  email: string;
  name: string;
};

export type Users = {
  id: string;
  full_name: string;
  first_name: string | null;
  last_name: string | null;
  job_title: string;
  company_name: string;
  website: string;
  linkedin: string;
  twitter: string | null;
  facebook: string | null;
  address: string;
  street: string | null;
  city: string;
  state: string | null;
  postal_code: string | null;
  country: string;
  industry: string | null;
  logo_url: string | null;
  notes: string | null;
  source: string | null;
  date_collected: string | null;
  ocr_confidence: number | null;
  card_image_url: string | null;
  email: string[];
  phone_number: string[];
  raw_text: string;
  gender: boolean | null;
  front_image_link: string | null;
  back_image_link: string | null;
  collected_at: string | null;
};

// ===============================
// 🟢 Table Columns
// ===============================

export type ColumnsKey =
  | "full_name"
  | "job_title"
  | "company_name"
  | "email"
  | "phone_number"
  | "country"
  | "industry"
  | "date_collected"
  | "actions";

export const INITIAL_VISIBLE_COLUMNS: ColumnsKey[] = [
  "full_name",
  "job_title",
  "company_name",
  "email",
  "phone_number",
  "country",
  "actions",
];

export const columns = [
  { name: "Full Name", uid: "full_name", width: 250 },
  { name: "Job Title", uid: "job_title", width: 200 },
  { name: "Company", uid: "company_name", width: 200 },
  { name: "Email", uid: "email" },
  { name: "Phone", uid: "phone_number" },
  { name: "Country", uid: "country" },
  { name: "Industry", uid: "industry" },
  { name: "Date Collected", uid: "date_collected" },
  { name: "Actions", uid: "actions", isFixed: true },
] as const;

export type Column = (typeof columns)[number] & {
  sortDirection?: "ascending" | "descending";
  width?: number;
  isFixed?: boolean;
};
