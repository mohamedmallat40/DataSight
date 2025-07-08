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

  const handleLogin = async () => {
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
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-sm text-default-500">Sign in to your account</p>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Input
              autoFocus
              label="Email"
              placeholder="Enter your email"
              variant="bordered"
              value={email}
              onValueChange={setEmail}
              startContent={
                <Icon
                  icon="lucide:mail"
                  className="text-default-400"
                  width={18}
                />
              }
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              variant="bordered"
              value={password}
              onValueChange={setPassword}
              type={showPassword ? "text" : "password"}
              startContent={
                <Icon
                  icon="lucide:lock"
                  className="text-default-400"
                  width={18}
                />
              }
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  <Icon
                    icon={showPassword ? "lucide:eye-off" : "lucide:eye"}
                    className="text-default-400 hover:text-default-600"
                    width={18}
                  />
                </button>
              }
            />
            <div className="flex justify-between items-center">
              <Link
                size="sm"
                className="cursor-pointer"
                onClick={() => {
                  // Handle forgot password
                  alert("Forgot password functionality would go here");
                }}
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-col gap-3">
          <Button
            color="primary"
            isLoading={isLoading}
            onPress={handleLogin}
            className="w-full"
            isDisabled={!email || !password}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link
              size="sm"
              className="cursor-pointer"
              onClick={() => {
                handleClose();
                onSwitchToRegister();
              }}
            >
              Sign up
            </Link>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
