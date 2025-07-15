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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setEmail("");
    setPassword("");
    setRememberMe(false);
    setError("");
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      placement="center"
      backdrop="blur"
      size="lg"
      classNames={{
        base: "bg-background",
        backdrop: "bg-black/50 backdrop-blur-sm",
      }}
    >
      <ModalContent className="w-full max-w-md">
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
              isRequired
              autoFocus
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              type="email"
              variant="bordered"
              value={email}
              onValueChange={setEmail}
              isInvalid={!!error}
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
              isInvalid={!!error}
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
              isDisabled={!email || !password || isLoading}
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
              startContent={<Icon icon="skill-icons:linkedin" width={20} />}
              variant="bordered"
              fullWidth
            >
              Continue with LinkedIn
            </Button>
            <Button
              startContent={
                <Icon
                  className="text-foreground"
                  icon="simple-icons:x"
                  width={20}
                />
              }
              variant="bordered"
              fullWidth
            >
              Continue with X
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
