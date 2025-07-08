"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox,
  Link,
  Form,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
}: LoginModalProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      // Set authentication token
      localStorage.setItem("auth_token", "demo_token");
      localStorage.setItem(
        "user_session",
        JSON.stringify({
          email: "demo@allcaremedical.com",
          name: "Demo User",
          loginTime: new Date().toISOString(),
        }),
      );

      setIsLoading(false);
      onClose();

      // Redirect to contacts
      router.push("/contacts");
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Implement social login logic here
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      size="sm"
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-center">
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-small text-default-500">
            Sign in to All Care Medical
          </p>
        </ModalHeader>

        <ModalBody>
          <Form
            className="flex flex-col gap-4"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            <Input
              isRequired
              label="Email Address"
              labelPlacement="outside"
              name="email"
              placeholder="Enter your email"
              type="email"
              startContent={
                <Icon
                  className="text-default-400"
                  icon="lucide:mail"
                  width={18}
                />
              }
            />
            <Input
              isRequired
              label="Password"
              labelPlacement="outside"
              name="password"
              placeholder="Enter your password"
              type={isVisible ? "text" : "password"}
              startContent={
                <Icon
                  className="text-default-400"
                  icon="lucide:lock"
                  width={18}
                />
              }
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <Icon
                      className="text-default-400"
                      icon="lucide:eye-off"
                      width={20}
                    />
                  ) : (
                    <Icon
                      className="text-default-400"
                      icon="lucide:eye"
                      width={20}
                    />
                  )}
                </button>
              }
            />
            <div className="flex w-full items-center justify-between px-1 py-2">
              <Checkbox name="remember" size="sm">
                Remember me
              </Checkbox>
              <Link className="text-default-500" href="#" size="sm">
                Forgot password?
              </Link>
            </div>
            <Button
              className="w-full"
              color="primary"
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </Form>

          <div className="flex items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">OR</p>
            <Divider className="flex-1" />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              startContent={<Icon icon="logos:google-icon" width={20} />}
              variant="bordered"
              onPress={() => handleSocialLogin("google")}
            >
              Continue with Google
            </Button>
            <Button
              startContent={
                <Icon
                  className="text-default-500"
                  icon="lucide:github"
                  width={20}
                />
              }
              variant="bordered"
              onPress={() => handleSocialLogin("github")}
            >
              Continue with Github
            </Button>
          </div>
        </ModalBody>

        <ModalFooter className="justify-center">
          <p className="text-center text-small">
            Need to create an account?&nbsp;
            <Link
              className="cursor-pointer"
              size="sm"
              onPress={() => {
                onClose();
                onSwitchToRegister();
              }}
            >
              Sign Up
            </Link>
          </p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
