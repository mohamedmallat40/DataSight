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
import { Link } from "@heroui/link";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { useLocale } from "@react-aria/i18n";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { LanguageSwitcher } from "./LanguageSwitcher";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { HeartFilledIcon } from "@/components/icons";
import { useTranslations } from "@/hooks/use-translation";
import { useAuth } from "@/contexts/auth-context";

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
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);

    return () => clearTimeout(timer);
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
      icon: "solar:users-group-rounded-linear",
    },
    {
      label: "AI Chat",
      href: "/ai-chat",
      icon: "solar:chat-round-dots-linear",
    },
    {
      label: "Statistics",
      href: "/statistics",
      icon: "solar:chart-square-linear",
    },
  ];

  const companyLogo = (
    <NextLink
      className={clsx(
        "flex items-center gap-2.5 transition-all duration-200 hover:opacity-90",
        isRTL ? "flex-row-reverse" : "",
      )}
      href="/"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-xl">📊</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-foreground text-sm sm:text-base leading-tight">
            DataSight
          </span>
          <span className="text-tiny text-default-500 hidden sm:block">
            Contact Intelligence
          </span>
        </div>
      </div>
    </NextLink>
  );

  const actionButtons = (
    <div className="flex items-center gap-2">
      {/* CTA Button */}
      <Button
        isExternal
        as={Link}
        className="hidden md:flex bg-primary hover:bg-primary-600 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
        href={siteConfig.links.sponsor}
        size="sm"
        startContent={<Icon icon="solar:rocket-linear" width={16} />}
        variant="solid"
      >
        {t("navbar_slogon") || "Get Started"}
      </Button>

      {/* Language & Theme Controls */}
      <div className="flex items-center gap-1">
        <LanguageSwitcher
          showFlag={true}
          size="sm"
          variant="compact"
          onChange={handleLocaleChange}
        />
        <ThemeSwitch />
      </div>

      {/* Profile/User Menu for authenticated users */}
      {isAuthenticated && (
        <Dropdown className="hidden lg:block" placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform"
              size="sm"
              src="https://ui-avatars.com/api/?name=User&background=random"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="user-info" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">demo@sultan.sa</p>
            </DropdownItem>
            <DropdownItem
              key="profile"
              startContent={<Icon icon="solar:user-id-linear" />}
              onPress={() => router.push("/profile")}
            >
              Profile Settings
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              startContent={<Icon icon="solar:logout-2-linear" />}
              onPress={logout}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );

  // Remove mounting check that was causing language switcher to not render

  return (
    <>
      <HeroUINavbar
        className={clsx(
          "px-4 backdrop-blur-lg bg-background/85 border-b border-default-200/70 supports-[backdrop-filter]:bg-background/60",
          isRTL ? "rtl" : "",
        )}
        isMenuOpen={isMenuOpen}
        maxWidth="full"
        position="sticky"
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
          <div className="hidden lg:flex gap-1 ml-8">
            {navigationItems.map((item) => (
              <NavbarItem key={item.href}>
                <Link
                  className={clsx(
                    "flex items-center gap-2 transition-all duration-200 font-medium px-4 py-2.5 rounded-xl relative",
                    router.asPath === item.href
                      ? "text-primary bg-primary/8 font-semibold shadow-sm ring-1 ring-primary/20"
                      : "text-default-700 hover:text-primary hover:bg-default-100/60",
                  )}
                  href={item.href}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    handleNavigation(item.href, item.external);
                  }}
                >
                  {item.icon && (
                    <Icon
                      className={
                        router.asPath === item.href
                          ? "text-primary"
                          : "text-default-500"
                      }
                      height={18}
                      icon={item.icon}
                      width={18}
                    />
                  )}
                  {item.label}
                  {item.badge && (
                    <span className="bg-primary text-white text-tiny px-1.5 py-0.5 rounded-full ml-1">
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
                <Icon height={20} icon="solar:close-circle-linear" width={20} />
              </Button>
            </div>
            <Divider />
          </div>

          {/* Mobile Navigation Items */}
          <div className="flex flex-col gap-2">
            {navigationItems.map((item, index) => (
              <NavbarMenuItem key={item.href}>
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -20 }}
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
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      handleNavigation(item.href, item.external);
                    }}
                  >
                    {item.icon && (
                      <Icon
                        className={
                          router.asPath === item.href
                            ? "text-primary"
                            : "text-default-500"
                        }
                        height={20}
                        icon={item.icon}
                        width={20}
                      />
                    )}
                    <span className="font-medium">{item.label}</span>
                    {item.external && (
                      <Icon
                        className="ml-auto text-default-400"
                        height={16}
                        icon="solar:external-link-linear"
                        width={16}
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
              fullWidth
              isExternal
              as={Link}
              className="bg-gradient-to-r from-primary to-secondary text-white font-medium"
              endContent={
                <HeartFilledIcon
                  className="text-white"
                  height={16}
                  width={16}
                />
              }
              href={siteConfig.links.sponsor}
              size="lg"
            >
              {t("navbar_slogon") || "Get Started"}
            </Button>

            {/* User Profile Section */}
            {isAuthenticated && (
              <div className="flex items-center gap-3 p-4 bg-default-50 rounded-lg">
                <Avatar
                  size="sm"
                  src="https://ui-avatars.com/api/?name=User&background=random"
                />
                <div className="flex-1">
                  <p className="text-small font-medium">Demo User</p>
                  <p className="text-tiny text-default-500">demo@sultan.sa</p>
                </div>
                <Dropdown placement="top-end">
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <Icon
                        height={18}
                        icon="solar:menu-dots-linear"
                        width={18}
                      />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem
                      key="profile"
                      startContent={<Icon icon="solar:user-id-linear" />}
                      onPress={() => router.push("/profile")}
                    >
                      Profile Settings
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      color="danger"
                      startContent={<Icon icon="solar:logout-2-linear" />}
                      onPress={logout}
                    >
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}
          </div>
        </NavbarMenu>
      </HeroUINavbar>
    </>
  );
};

export default Navbar;
