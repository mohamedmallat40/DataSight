import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useLocale } from "@react-aria/i18n";

import { LanguageSwitcher } from "./LanguageSwitcher";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  GithubIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";
import { useTranslations } from "@/hooks/use-translation";

export const Navbar = ({ setLocale }: any) => {
  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
  };
  const { locale } = useLocale();
  const isRTL = locale === "ar";

  const { t } = useTranslations();

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          P
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <HeroUINavbar
      className={isRTL ? "reverse" : ""}
      maxWidth="xl"
      position="sticky"
    >
      <NavbarContent
        className={
          isRTL
            ? "basis-1/5 sm:basis-full flex-row-reverse"
            : "basis-1/5 sm:basis-full"
        }
        justify="start"
      >
        <NavbarBrand
          className={clsx("gap-3 max-w-fit", isRTL ? "flex-row-reverse" : "")}
        >
          <NextLink
            className={clsx(
              "flex justify-start items-center gap-1",
              isRTL ? "flex-row-reverse" : ""
            )}
            href="/"
          >
            <Logo />
            <p className="font-bold text-inherit">
              DEMO ALL CARE MEDICAL GROUP
            </p>
          </NextLink>
        </NavbarBrand>
        {/* <div
          className={
            isRTL
              ? "hidden lg:flex gap-4 justify-start ml-auto flex-row-reverse"
              : "hidden lg:flex gap-4 justify-start ml-2 "
          }
        >
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  const id = item.href.replace("#", "");
                  const el = document.getElementById(id);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
              >
                {t(`${item.label}`)}
              </a>
            </NavbarItem>
          ))}
        </div> */}
      </NavbarContent>

      <NavbarContent
        className={
          isRTL
            ? "hidden sm:flex basis-1/5 sm:basis-full flex-row-reverse"
            : "hidden sm:flex basis-1/5 sm:basis-full"
        }
        justify="end"
      >
        {/* <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem> */}
        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            endContent={<HeartFilledIcon className="text-danger" />}
            href={siteConfig.links.sponsor}
            variant="flat"
          >
            {t("navbar_slogon")}
          </Button>
        </NavbarItem>
        <NavbarItem
          className={
            isRTL
              ? "hidden sm:flex gap-2 flex-row-reverse"
              : "hidden sm:flex gap-2"
          }
        >
          <LanguageSwitcher onChange={handleLocaleChange} />
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        className={
          isRTL
            ? "sm:hidden basis-1 pl-4 flex-row-reverse"
            : "sm:hidden basis-1 pl-4"
        }
        justify={"end"}
      >
        <LanguageSwitcher onChange={handleLocaleChange} />
        <ThemeSwitch />
      </NavbarContent>
    </HeroUINavbar>
  );
};
