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

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate registration process
    setTimeout(() => {
      // Set authentication token
      localStorage.setItem("auth_token", "demo_token");
      localStorage.setItem(
        "user_session",
        JSON.stringify({
          email: "newuser@allcaremedical.com",
          name: "New User",
          loginTime: new Date().toISOString(),
        }),
      );

      setIsLoading(false);
      onClose();

      // Redirect to contacts
      router.push("/contacts");
    }, 2000);
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`Register with ${provider}`);
    // Implement social registration logic here
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      size="sm"
      scrollBehavior="inside"
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-center">
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-small text-default-500">
            Join All Care Medical today
          </p>
        </ModalHeader>

        <ModalBody>
          <Form
            className="flex flex-col gap-4"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-2 gap-3">
              <Input
                isRequired
                label="First Name"
                labelPlacement="outside"
                name="firstName"
                placeholder="First name"
                startContent={
                  <Icon
                    className="text-default-400"
                    icon="lucide:user"
                    width={18}
                  />
                }
              />
              <Input
                isRequired
                label="Last Name"
                labelPlacement="outside"
                name="lastName"
                placeholder="Last name"
                startContent={
                  <Icon
                    className="text-default-400"
                    icon="lucide:user"
                    width={18}
                  />
                }
              />
            </div>

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
              placeholder="Create a password"
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

            <Input
              isRequired
              label="Confirm Password"
              labelPlacement="outside"
              name="confirmPassword"
              placeholder="Confirm your password"
              type={isConfirmVisible ? "text" : "password"}
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
                  onClick={toggleConfirmVisibility}
                >
                  {isConfirmVisible ? (
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

            <div className="flex flex-col gap-3 pt-2">
              <Checkbox name="terms" size="sm">
                <span className="text-small">
                  I agree to the{" "}
                  <Link href="#" size="sm">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" size="sm">
                    Privacy Policy
                  </Link>
                </span>
              </Checkbox>
              <Checkbox name="newsletter" size="sm">
                <span className="text-small">
                  Subscribe to our newsletter for updates
                </span>
              </Checkbox>
            </div>

            <Button
              className="w-full"
              color="primary"
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
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
              onPress={() => handleSocialRegister("google")}
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
              onPress={() => handleSocialRegister("github")}
            >
              Continue with Github
            </Button>
          </div>
        </ModalBody>

        <ModalFooter className="justify-center">
          <p className="text-center text-small">
            Already have an account?&nbsp;
            <Link
              className="cursor-pointer"
              size="sm"
              onPress={() => {
                onClose();
                onSwitchToLogin();
              }}
            >
              Sign In
            </Link>
          </p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
