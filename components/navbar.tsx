import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import NextLink from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { useLocale } from "@react-aria/i18n";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { HeartFilledIcon, SearchIcon, Logo } from "@/components/icons";
import { useTranslations } from "@/hooks/use-translation";
import { Icon } from "@iconify/react";

interface NavbarProps {
  setLocale: (locale: string) => void;
}

interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  external?: boolean;
}

export const Navbar = ({ setLocale }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { locale } = useLocale();
  const isRTL = locale === "ar";
  const { t } = useTranslations();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
  };

  const handleNavigation = (href: string, external = false) => {
    if (external) {
      window.open(href, "_blank");
      return;
    }

    if (href.startsWith("#")) {
      const element = document.getElementById(href.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(href);
    }
    setIsMenuOpen(false);
  };

  // Enhanced navigation items with icons and descriptions
  const navigationItems: NavigationItem[] = [
    {
      label: "Contacts",
      href: "/contacts",
      icon: "solar:users-group-two-rounded-linear",
    },
    {
      label: "Statistics",
      href: "/statistics",
      icon: "lucide:line-chart",
    },
  ];

  const companyLogo = (
    <NextLink
      href="/"
      className={clsx(
        "flex items-center gap-2 transition-all duration-200 hover:opacity-80",
        isRTL ? "flex-row-reverse" : "",
      )}
    >
      <Logo />
      <div className="flex flex-col">
        <span className="font-bold text-inherit text-sm sm:text-base leading-tight">
          ALL CARE MEDICAL
        </span>
        <span className="text-tiny text-default-500 hidden sm:block">
          Healthcare Management
        </span>
      </div>
    </NextLink>
  );

  const actionButtons = (
    <div className="flex items-center gap-2">
      {/* CTA Button */}
      <Button
        as={Link}
        href={siteConfig.links.sponsor}
        isExternal
        className="hidden md:flex bg-gradient-to-r from-primary to-secondary text-white font-medium"
        endContent={
          <HeartFilledIcon className="text-white" width={16} height={16} />
        }
        size="sm"
        variant="solid"
      >
        {t("navbar_slogon") || "Get Started"}
      </Button>

      {/* Language & Theme Controls */}
      <div className="flex items-center gap-1">
        <LanguageSwitcher onChange={handleLocaleChange} />
        <ThemeSwitch />
      </div>

      {/* Profile/User Menu for larger screens */}
      <Dropdown placement="bottom-end" className="hidden lg:block">
        <DropdownTrigger>
          <Avatar
            as="button"
            className="transition-transform"
            size="sm"
            src="https://ui-avatars.com/api/?name=User&background=random"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">demo@example.com</p>
          </DropdownItem>
          <DropdownItem
            key="settings"
            startContent={<Icon icon="solar:settings-linear" />}
          >
            Settings
          </DropdownItem>
          <DropdownItem
            key="help"
            startContent={<Icon icon="solar:help-circle-linear" />}
          >
            Help & Support
          </DropdownItem>
          <DropdownItem
            key="logout"
            color="danger"
            startContent={<Icon icon="solar:logout-2-linear" />}
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );

  if (!mounted) {
    return (
      <HeroUINavbar className="px-2.5" maxWidth="full" position="sticky">
        <NavbarContent justify="start">
          <NavbarBrand>{companyLogo}</NavbarBrand>
        </NavbarContent>
        <NavbarContent justify="end">
          <div className="w-20 h-8 bg-default-100 rounded animate-pulse"></div>
        </NavbarContent>
      </HeroUINavbar>
    );
  }

  return (
    <>
      <HeroUINavbar
        className={clsx(
          "px-2.5 backdrop-blur-md bg-background/80 border-b border-default-200/50",
          isRTL ? "rtl" : "",
        )}
        maxWidth="full"
        position="sticky"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        {/* Main Brand Section */}
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand className="flex-grow justify-center sm:justify-start">
            {companyLogo}
          </NavbarBrand>
        </NavbarContent>

        {/* Desktop Brand */}
        <NavbarContent className="hidden sm:flex gap-4" justify="start">
          <NavbarBrand>{companyLogo}</NavbarBrand>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-6 ml-8">
            {navigationItems.map((item) => (
              <NavbarItem key={item.href}>
                <Link
                  className={clsx(
                    "flex items-center gap-2 transition-all duration-200 font-medium px-3 py-2 rounded-lg",
                    router.asPath === item.href
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-foreground hover:text-primary hover:bg-primary/5",
                  )}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.href, item.external);
                  }}
                >
                  {item.icon && (
                    <Icon
                      icon={item.icon}
                      width={18}
                      height={18}
                      className={
                        router.asPath === item.href ? "text-primary" : ""
                      }
                    />
                  )}
                  {item.label}
                  {item.badge && (
                    <span className="bg-primary text-white text-tiny px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </NavbarItem>
            ))}
          </div>
        </NavbarContent>

        {/* Actions Section */}
        <NavbarContent justify="end">{actionButtons}</NavbarContent>

        {/* Mobile Menu */}
        <NavbarMenu className="bg-background/95 backdrop-blur-xl border-r border-default-200/50">
          {/* Mobile Header */}
          <div className="flex flex-col gap-4 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Menu</h3>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => setIsMenuOpen(false)}
              >
                <Icon icon="solar:close-circle-linear" width={20} height={20} />
              </Button>
            </div>
            <Divider />
          </div>

          {/* Mobile Navigation Items */}
          <div className="flex flex-col gap-2">
            {navigationItems.map((item, index) => (
              <NavbarMenuItem key={item.href}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    className={clsx(
                      "flex items-center gap-3 w-full py-3 px-4 rounded-lg transition-all duration-200",
                      router.asPath === item.href
                        ? "bg-primary/15 text-primary font-semibold border border-primary/20"
                        : "text-foreground hover:text-primary hover:bg-primary/5",
                    )}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(item.href, item.external);
                    }}
                  >
                    {item.icon && (
                      <Icon
                        icon={item.icon}
                        width={20}
                        height={20}
                        className={
                          router.asPath === item.href
                            ? "text-primary"
                            : "text-default-500"
                        }
                      />
                    )}
                    <span className="font-medium">{item.label}</span>
                    {item.external && (
                      <Icon
                        icon="solar:external-link-linear"
                        width={16}
                        height={16}
                        className="ml-auto text-default-400"
                      />
                    )}
                  </Link>
                </motion.div>
              </NavbarMenuItem>
            ))}
          </div>

          {/* Mobile Actions */}
          <div className="flex flex-col gap-4 mt-8 px-4">
            <Divider />

            {/* Mobile CTA */}
            <Button
              as={Link}
              href={siteConfig.links.sponsor}
              isExternal
              className="bg-gradient-to-r from-primary to-secondary text-white font-medium"
              endContent={
                <HeartFilledIcon
                  className="text-white"
                  width={16}
                  height={16}
                />
              }
              size="lg"
              fullWidth
            >
              {t("navbar_slogon") || "Get Started"}
            </Button>

            {/* User Profile Section */}
            <div className="flex items-center gap-3 p-4 bg-default-50 rounded-lg">
              <Avatar
                size="sm"
                src="https://ui-avatars.com/api/?name=User&background=random"
              />
              <div className="flex-1">
                <p className="text-small font-medium">Demo User</p>
                <p className="text-tiny text-default-500">demo@example.com</p>
              </div>
              <Button isIconOnly size="sm" variant="light">
                <Icon icon="solar:settings-linear" width={18} height={18} />
              </Button>
            </div>
          </div>
        </NavbarMenu>
      </HeroUINavbar>
    </>
  );
};

export default Navbar;
