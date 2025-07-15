import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Link,
  Checkbox,
  Divider,
  Form,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSwitchToRegister: () => void;
}

export function LoginModal({
  isOpen,
  onOpenChange,
  onSwitchToRegister,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, store a fake token
      localStorage.setItem("auth_token", "demo-token-" + Date.now());
      localStorage.setItem(
        "user_session",
        JSON.stringify({
          email,
          name: "Demo User",
          loginTime: new Date().toISOString(),
        }),
      );

      // Close modal and trigger auth state update
      onOpenChange(false);
      window.location.reload(); // Simple way to update auth state
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setIsLoading(false);
    setRememberMe(false);
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      placement="center"
      backdrop="blur"
      classNames={{
        base: "bg-background",
        backdrop: "bg-black/50 backdrop-blur-sm",
      }}
    >
      <ModalContent className="w-full max-w-sm">
        <ModalHeader className="flex flex-col items-center pb-6 pt-8">
          <div className="rounded-lg bg-gradient-to-r from-primary to-secondary p-3 mb-4">
            <Icon
              icon="solar:document-text-linear"
              className="text-white"
              width={32}
            />
          </div>
          <p className="text-xl font-medium text-foreground">Welcome Back</p>
          <p className="text-small text-default-500">
            Log in to your account to continue
          </p>
        </ModalHeader>

        <ModalBody className="px-6">
          <Form
            className="flex flex-col gap-4"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            <Input
              isRequired
              autoFocus
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              type="email"
              variant="bordered"
              value={email}
              onValueChange={setEmail}
            />
            <Input
              isRequired
              label="Password"
              name="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              variant="bordered"
              value={password}
              onValueChange={setPassword}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-closed-linear"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-bold"
                    />
                  )}
                </button>
              }
            />
            <div className="flex w-full items-center justify-between px-1 py-2">
              <Checkbox
                name="remember"
                size="sm"
                isSelected={rememberMe}
                onValueChange={setRememberMe}
              >
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
              isDisabled={!email || !password}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </Form>

          <div className="flex items-center gap-4 py-4">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">OR</p>
            <Divider className="flex-1" />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              startContent={<Icon icon="flat-color-icons:google" width={20} />}
              variant="bordered"
              fullWidth
            >
              Continue with Google
            </Button>
            <Button
              startContent={
                <Icon
                  className="text-default-500"
                  icon="fe:github"
                  width={20}
                />
              }
              variant="bordered"
              fullWidth
            >
              Continue with Github
            </Button>
          </div>
        </ModalBody>

        <ModalFooter className="justify-center pb-6">
          <p className="text-center text-small">
            Need to create an account?{" "}
            <Link
              href="#"
              size="sm"
              className="cursor-pointer"
              onClick={() => {
                handleClose();
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
