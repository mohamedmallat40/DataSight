export enum FrequencyEnum {
  Yearly = "yearly",
  Quarterly = "quarterly",
}

export type Frequency = {
  key: FrequencyEnum;
  label: string;
  priceSuffix: string;
};

export type Tier = {
  key: string;
  title: string;
  description: string;
  price: string | Record<FrequencyEnum, string>;
  href: string;
  mostPopular?: boolean;
  features?: string[];
  buttonText: string;
  buttonColor:
    | "primary"
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  buttonVariant:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
};
