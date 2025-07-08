"use client";

import type { NavbarProps } from "@heroui/react";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Button,
  Divider,
  cn,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Logo } from "./icons";

const menuItems = [
  "About",
  "Features",
  "Customers",
  "Pricing",
  "Enterprise",
  "Documentation",
  "Contact Us",
];

const LandingNavbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ classNames = {}, ...props }, ref) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleAuthAction = (action: "login" | "register") => {
      const eventName = action === "login" ? "openLogin" : "openRegister";
      const event = new CustomEvent(eventName);
      window.dispatchEvent(event);
    };

    return (
      <Navbar
        ref={ref}
        {...props}
        classNames={{
          base: cn("border-default-100 bg-transparent", {
            "bg-default-200/50 dark:bg-default-100/50": isMenuOpen,
          }),
          wrapper: "w-full justify-center",
          item: "hidden md:flex",
          ...classNames,
        }}
        height="60px"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        {/* Left Content */}
        <NavbarBrand>
          <div className="rounded-full bg-gradient-to-r from-primary to-secondary p-2">
            <Logo className="text-white" />
          </div>
          <span className="ml-2 text-small font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ALL CARE MEDICAL
          </span>
        </NavbarBrand>

        {/* Center Content */}
        <NavbarContent justify="center">
          <NavbarItem isActive className="data-[active='true']:font-medium">
            <Link
              aria-current="page"
              className="text-primary font-medium"
              href="#"
              size="sm"
            >
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-default-500 hover:text-primary transition-colors"
              href="#features"
              size="sm"
            >
              Features
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-default-500 hover:text-primary transition-colors"
              href="#customers"
              size="sm"
            >
              Customers
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-default-500 hover:text-primary transition-colors"
              href="#about"
              size="sm"
            >
              About Us
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-default-500 hover:text-primary transition-colors"
              href="#integrations"
              size="sm"
            >
              Integrations
            </Link>
          </NavbarItem>
        </NavbarContent>

        {/* Right Content */}
        <NavbarContent className="hidden md:flex" justify="end">
          <NavbarItem className="ml-2 !flex gap-2">
            <Button
              className="text-default-500"
              radius="full"
              variant="light"
              onPress={() => handleAuthAction("login")}
            >
              Login
            </Button>
            <Button
              className="bg-default-foreground font-medium text-background"
              color="secondary"
              endContent={<Icon icon="solar:alt-arrow-right-linear" />}
              radius="full"
              variant="flat"
              onPress={() => handleAuthAction("register")}
            >
              Get Started
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenuToggle className="text-default-400 md:hidden" />

        <NavbarMenu
          className="top-[calc(var(--navbar-height)_-_1px)] max-h-fit bg-default-200/50 pb-6 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
          motionProps={{
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: {
              ease: "easeInOut",
              duration: 0.2,
            },
          }}
        >
          <NavbarMenuItem>
            <Button
              fullWidth
              as={Link}
              variant="faded"
              onPress={() => handleAuthAction("login")}
            >
              Sign In
            </Button>
          </NavbarMenuItem>
          <NavbarMenuItem className="mb-4">
            <Button
              fullWidth
              className="bg-foreground text-background"
              onPress={() => handleAuthAction("register")}
            >
              Get Started
            </Button>
          </NavbarMenuItem>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="mb-2 w-full text-default-500"
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                size="md"
              >
                {item}
              </Link>
              {index < menuItems.length - 1 && (
                <Divider className="opacity-50" />
              )}
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    );
  },
);

LandingNavbar.displayName = "LandingNavbar";

export { LandingNavbar };
