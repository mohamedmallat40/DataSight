"use client";

import React from "react";
import { Button, Input, Checkbox, Link, Form, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

import DefaultLayout from "@/layouts/default";

export default function RegisterPage() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Register submitted");
  };

  return (
    <DefaultLayout>
      <div className="flex h-full w-full items-center justify-center py-8">
        <div className="flex w-full max-w-sm flex-col gap-6 rounded-large bg-content1 px-8 pb-10 pt-8 shadow-medium">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-small text-default-500">
              Join All Care Medical today
            </p>
          </div>

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

            <Button className="w-full" color="primary" type="submit">
              Create Account
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
            >
              Continue with Github
            </Button>
          </div>

          <p className="text-center text-small">
            Already have an account?&nbsp;
            <Link href="/login" size="sm">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </DefaultLayout>
  );
}
