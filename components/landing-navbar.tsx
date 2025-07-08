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
          base: cn(
            "border-default-200 bg-background/80 shadow-sm backdrop-blur-md",
            {
              "bg-background/90 backdrop-blur-md": isMenuOpen,
            },
          ),
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
          <div className="rounded-lg bg-gradient-to-r from-primary to-secondary p-1.5">
            <Icon
              icon="solar:document-text-bold"
              className="text-white"
              width={20}
            />
          </div>
          <span className="ml-2 text-small font-semibold text-foreground">
            Convents
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
              About Us
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-default-500 hover:text-primary transition-colors"
              href="#customers"
              size="sm"
            >
              Our Features
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-default-500 hover:text-primary transition-colors"
              href="#pricing"
              size="sm"
            >
              Pricing
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-default-500 hover:text-primary transition-colors"
              href="#testimonials"
              size="sm"
            >
              Testimonials
            </Link>
          </NavbarItem>
        </NavbarContent>

        {/* Right Content */}
        <NavbarContent className="hidden md:flex" justify="end">
          <NavbarItem className="ml-2 !flex gap-2">
            <Button
              className="text-default-500 hover:text-primary"
              radius="full"
              variant="light"
              onPress={() => handleAuthAction("login")}
            >
              Login
            </Button>
            <Button
              className="bg-gradient-to-r from-primary to-secondary font-medium text-white shadow-lg hover:shadow-xl transition-all"
              radius="full"
              variant="solid"
              onPress={() => handleAuthAction("register")}
            >
              Get Started
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenuToggle className="text-default-400 md:hidden" />

        <NavbarMenu
          className="top-[calc(var(--navbar-height)_-_1px)] max-h-fit bg-gradient-to-b from-primary/5 to-secondary/5 pb-6 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150 border-primary/10"
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
              className="text-primary border-primary/20 bg-primary/5"
              variant="bordered"
              onPress={() => handleAuthAction("login")}
            >
              Login
            </Button>
          </NavbarMenuItem>
          <NavbarMenuItem className="mb-4">
            <Button
              fullWidth
              className="bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-lg"
              onPress={() => handleAuthAction("register")}
            >
              Get Started
            </Button>
          </NavbarMenuItem>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="mb-2 w-full text-default-600 hover:text-primary transition-colors font-medium"
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                size="md"
              >
                {item}
              </Link>
              {index < menuItems.length - 1 && (
                <Divider className="opacity-30 bg-primary/20" />
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
