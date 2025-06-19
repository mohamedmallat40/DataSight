import { useTheme } from "next-themes";

import {
  alwasaet,
  proxymLight,
  aramco,
  extraexpertise,
  proxymDark,
  zacta,
  dnextDark,
  dnextLight,
  tawazi,
  tawazi_dark,
} from "../components/logos";

import Network from "./table";

import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const { theme } = useTheme();

  const logos = [
    {
      key: "alwasaet",
      logo: alwasaet,
    },
    {
      key: "proxym-it",
      logo: theme === "dark" ? proxymLight : proxymDark,
    },
    {
      key: "dnext",
      logo: theme === "dark" ? dnextLight : dnextDark,
    },
    {
      key: "aramco",
      logo: aramco,
    },
    {
      key: "extraexpertise",
      logo: extraexpertise,
    },
    {
      key: "zacta",
      logo: zacta,
    },
    {
      key: "tawazi",
      logo: theme === "dark" ? tawazi : tawazi_dark,
    },
  ];

  return (
    <DefaultLayout>
      <Network />
      {/* <HeroLandingSection />
      <Services />
      <ScrollingBanner shouldPauseOnHover gap="80px">
        {logos.map(({ key, logo }) => (
          <div
            key={key}
            className="flex items-center justify-center text-foreground"
          >
            {logo}
          </div>
        ))}
      </ScrollingBanner>
      <UIUXSection />
      <TachnoSection />
      <AdditionalDetails />
      <Footer /> */}
    </DefaultLayout>
  );
}
