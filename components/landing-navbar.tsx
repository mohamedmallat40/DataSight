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

const menuItems = [
  "Home",
  "About Us",
  "Our Features",
  "Pricing",
  "Testimonials",
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
          base: cn("border-divider bg-background/60 backdrop-blur-lg", {
            "bg-background/80": isMenuOpen,
          }),
          wrapper: "w-full justify-center bg-transparent",
          item: "hidden md:flex",
          ...classNames,
        }}
        height="64px"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        {/* Left Content - Brand */}
        <NavbarBrand>
          <div className="flex items-center gap-2">
            <Icon
              icon="solar:code-circle-linear"
              className="w-6 h-6 text-primary"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-foreground text-sm sm:text-base leading-tight">
                PERLA CI
              </span>
              <span className="text-tiny text-default-500 hidden sm:block">
                Code Innovation Solutions
              </span>
            </div>
          </div>
        </NavbarBrand>

        {/* Center Content - Navigation */}
        <NavbarContent justify="center">
          <NavbarItem isActive>
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
              className="text-foreground/60 hover:text-foreground transition-colors"
              href="#about"
              size="sm"
            >
              About Us
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-foreground/60 hover:text-foreground transition-colors"
              href="#features"
              size="sm"
            >
              Our Features
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-foreground/60 hover:text-foreground transition-colors"
              href="#pricing"
              size="sm"
            >
              Pricing
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-foreground/60 hover:text-foreground transition-colors"
              href="#testimonials"
              size="sm"
            >
              Testimonials
            </Link>
          </NavbarItem>
        </NavbarContent>

        {/* Right Content - Actions */}
        <NavbarContent className="hidden md:flex" justify="end">
          <NavbarItem className="ml-2 !flex gap-2">
            <Button
              variant="light"
              radius="full"
              onPress={() => handleAuthAction("login")}
            >
              Login
            </Button>
            <Button
              color="primary"
              radius="full"
              variant="solid"
              onPress={() => handleAuthAction("register")}
            >
              Get Started
            </Button>
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Menu Toggle */}
        <NavbarMenuToggle className="md:hidden" />

        {/* Mobile Menu */}
        <NavbarMenu className="bg-background/80 backdrop-blur-lg">
          <NavbarMenuItem>
            <Button
              fullWidth
              color="primary"
              variant="bordered"
              onPress={() => handleAuthAction("login")}
            >
              Login
            </Button>
          </NavbarMenuItem>
          <NavbarMenuItem className="mb-4">
            <Button
              fullWidth
              color="primary"
              variant="solid"
              onPress={() => handleAuthAction("register")}
            >
              Get Started
            </Button>
          </NavbarMenuItem>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="mb-2 w-full text-foreground/60 hover:text-foreground transition-colors"
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                size="lg"
              >
                {item}
              </Link>
              {index < menuItems.length - 1 && <Divider className="my-2" />}
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    );
  },
);

LandingNavbar.displayName = "LandingNavbar";

export { LandingNavbar };
