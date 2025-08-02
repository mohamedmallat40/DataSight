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
  Select,
  SelectItem,
  Divider,
  Form,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface RegisterModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSwitchToLogin: () => void;
}

export function RegisterModal({
  isOpen,
  onOpenChange,
  onSwitchToLogin,
}: RegisterModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    "Doctor",
    "Nurse",
    "Administrator",
    "Manager",
    "Receptionist",
    "Other",
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      organization,
    } = formData;

    setError("");

    if (!firstName || !lastName || !email || !password || !organization) {
      setError("Please fill in all required fields");

      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");

      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");

      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, show success message
      alert(
        "Account created successfully! Please use demo@sultan.sa to login.",
      );

      // Close modal and switch to login
      handleClose();
      onSwitchToLogin();
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      organization: "",
      role: "",
    });
    setIsLoading(false);
    setError("");
    onOpenChange(false);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
      scrollBehavior="inside"
      size="lg"
      onOpenChange={handleClose}
    >
      <ModalContent className="w-full max-w-lg">
        <ModalHeader className="flex flex-col items-center pb-6 pt-8">
          <p className="text-xl font-medium text-foreground">Create Account</p>
          <p className="text-small text-default-500">Join PERLA CI</p>
        </ModalHeader>

        <ModalBody className="px-6">
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

            <div className="grid grid-cols-2 gap-3">
              <Input
                autoFocus
                isRequired
                isInvalid={!!error}
                label="First Name"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                variant="bordered"
                onValueChange={(value) => updateFormData("firstName", value)}
              />
              <Input
                isRequired
                isInvalid={!!error}
                label="Last Name"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                variant="bordered"
                onValueChange={(value) => updateFormData("lastName", value)}
              />
            </div>

            <Input
              isRequired
              isInvalid={!!error}
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              type="email"
              value={formData.email}
              variant="bordered"
              onValueChange={(value) => updateFormData("email", value)}
            />

            <Input
              isRequired
              isInvalid={!!error}
              label="Organization"
              name="organization"
              placeholder="Enter your organization"
              value={formData.organization}
              variant="bordered"
              onValueChange={(value) => updateFormData("organization", value)}
            />

            <Select
              label="Role (Optional)"
              name="role"
              placeholder="Select your role"
              selectedKeys={formData.role ? [formData.role] : []}
              variant="bordered"
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;

                updateFormData("role", value || "");
              }}
            >
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </Select>

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
              placeholder="Create password (min 6 characters)"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              variant="bordered"
              onValueChange={(value) => updateFormData("password", value)}
            />

            <Input
              isRequired
              endContent={
                <Button
                  isIconOnly
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="text-default-400 hover:text-foreground transition-colors min-w-6 h-6"
                  size="sm"
                  type="button"
                  variant="light"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              variant="bordered"
              onValueChange={(value) =>
                updateFormData("confirmPassword", value)
              }
            />

            <Button
              className="w-full"
              color="primary"
              isDisabled={
                !formData.firstName ||
                !formData.lastName ||
                !formData.email ||
                !formData.password ||
                !formData.organization
              }
              isLoading={isLoading}
              type="submit"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
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
            Already have an account?{" "}
            <Link
              className="cursor-pointer"
              href="#"
              size="sm"
              onClick={() => {
                handleClose();
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
