"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { Logo } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";

export default function LandingNavbar() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignUp = () => {
    router.push("/register");
  };

  return (
    <Navbar
      classNames={{
        base: "bg-background/60 backdrop-blur-md border-b border-default-200/20",
        wrapper: "px-4 sm:px-6",
        content: "gap-4 sm:gap-6",
      }}
      height="80px"
      maxWidth="full"
    >
      {/* Brand */}
      <NavbarBrand>
        <NextLink
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          href="/"
        >
          <Logo />
          <div className="flex flex-col">
            <span className="font-bold text-inherit text-sm sm:text-base leading-tight">
              ALL CARE MEDICAL
            </span>
            <span className="text-tiny text-default-500 hidden sm:block">
              AI-Powered Healthcare
            </span>
          </div>
        </NextLink>
      </NavbarBrand>

      {/* Navigation Items */}
      <NavbarContent className="hidden md:flex gap-8" justify="center">
        <NavbarItem>
          <NextLink
            className="text-foreground hover:text-primary transition-colors font-medium"
            href="#features"
          >
            Features
          </NextLink>
        </NavbarItem>
        <NavbarItem>
          <NextLink
            className="text-foreground hover:text-primary transition-colors font-medium"
            href="#ai"
          >
            AI Technology
          </NextLink>
        </NavbarItem>
        <NavbarItem>
          <NextLink
            className="text-foreground hover:text-primary transition-colors font-medium"
            href="#pricing"
          >
            Pricing
          </NextLink>
        </NavbarItem>
        <NavbarItem>
          <NextLink
            className="text-foreground hover:text-primary transition-colors font-medium"
            href="/contacts"
          >
            Demo
          </NextLink>
        </NavbarItem>
      </NavbarContent>

      {/* Actions */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <ThemeSwitch />
        </NavbarItem>

        <NavbarItem className="hidden sm:flex">
          <Button
            className="font-medium"
            radius="full"
            variant="light"
            onPress={handleLogin}
          >
            Sign In
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Button
            className="bg-gradient-to-r from-primary to-secondary text-white font-medium"
            radius="full"
            onPress={handleSignUp}
          >
            <Icon icon="solar:user-plus-outline" width={16} />
            Get Started
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
