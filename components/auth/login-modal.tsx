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

import { useAuth } from "@/contexts/auth-context";

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
  const [email, setEmail] = useState("demo@sultan.sa");
  const [password, setPassword] = useState("demo@sultan.sa");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const { login, isLoading } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;

    setError("");

    const result = await login(email, password);

    if (result.success) {
      // Close modal on successful login
      onOpenChange(false);
    } else {
      // Show error message
      setError(result.error || "Login failed");
    }
  };

  const handleClose = () => {
    setEmail("demo@sultan.sa");
    setPassword("demo@sultan.sa");
    setRememberMe(false);
    setError("");
    onOpenChange(false);
  };

  return (
    <Modal
      backdrop="blur"
      classNames={{
        base: "bg-background",
        backdrop: "bg-black/50 backdrop-blur-sm",
      }}
      isOpen={isOpen}
      placement="center"
      size="lg"
      onOpenChange={handleClose}
    >
      <ModalContent className="w-full max-w-lg">
        <ModalHeader className="flex flex-col items-center pb-6 pt-8">
          <p className="text-xl font-medium text-foreground">Welcome Back</p>
          <p className="text-small text-default-500">
            Log in to your account to continue
          </p>
        </ModalHeader>

        <ModalBody className="px-6">
          {/* Demo credentials hint */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
            <p className="text-xs text-primary font-medium mb-1">Demo Login:</p>
            <p className="text-xs text-default-600">Email: demo@sultan.sa</p>
            <p className="text-xs text-default-600">Password: demo@sultan.sa</p>
          </div>

          <Form
            className="flex flex-col gap-4"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            <Input
              autoFocus
              isRequired
              isInvalid={!!error}
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              type="email"
              value={email}
              variant="bordered"
              onValueChange={setEmail}
            />
            <Input
              isRequired
              endContent={
                <Button
                  isIconOnly
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-default-400 hover:text-foreground transition-colors min-w-6 h-6"
                  size="sm"
                  type="button"
                  variant="light"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Icon
                      className="pointer-events-none text-xl text-default-400"
                      icon="solar:eye-closed-linear"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-xl text-default-400"
                      icon="solar:eye-bold"
                    />
                  )}
                </Button>
              }
              isInvalid={!!error}
              label="Password"
              name="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={password}
              variant="bordered"
              onValueChange={setPassword}
            />
            <div className="flex w-full items-center justify-between px-1 py-2">
              <Checkbox
                isSelected={rememberMe}
                name="remember"
                size="sm"
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
              isDisabled={!email || !password || isLoading}
              isLoading={isLoading}
              type="submit"
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
              fullWidth
              startContent={<Icon icon="flat-color-icons:google" width={20} />}
              variant="bordered"
            >
              Continue with Google
            </Button>
            <Button
              fullWidth
              startContent={<Icon icon="skill-icons:linkedin" width={20} />}
              variant="bordered"
            >
              Continue with LinkedIn
            </Button>
            <Button
              fullWidth
              startContent={
                <Icon
                  className="text-foreground"
                  icon="simple-icons:x"
                  width={20}
                />
              }
              variant="bordered"
            >
              Continue with X
            </Button>
          </div>
        </ModalBody>

        <ModalFooter className="justify-center pb-6">
          <p className="text-center text-small">
            Need to create an account?{" "}
            <Link
              className="cursor-pointer"
              href="#"
              size="sm"
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
