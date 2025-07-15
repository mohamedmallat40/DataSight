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
      isOpen={isOpen}
      onOpenChange={handleClose}
      placement="center"
      backdrop="blur"
      size="lg"
      scrollBehavior="inside"
      classNames={{
        base: "bg-background",
        backdrop: "bg-black/50 backdrop-blur-sm",
      }}
    >
      <ModalContent className="w-full max-w-md">
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
                isRequired
                autoFocus
                label="First Name"
                name="firstName"
                placeholder="Enter first name"
                variant="bordered"
                value={formData.firstName}
                onValueChange={(value) => updateFormData("firstName", value)}
                isInvalid={!!error}
              />
              <Input
                isRequired
                label="Last Name"
                name="lastName"
                placeholder="Enter last name"
                variant="bordered"
                value={formData.lastName}
                onValueChange={(value) => updateFormData("lastName", value)}
                isInvalid={!!error}
              />
            </div>

            <Input
              isRequired
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              type="email"
              variant="bordered"
              value={formData.email}
              onValueChange={(value) => updateFormData("email", value)}
              isInvalid={!!error}
            />

            <Input
              isRequired
              label="Organization"
              name="organization"
              placeholder="Enter your organization"
              variant="bordered"
              value={formData.organization}
              onValueChange={(value) => updateFormData("organization", value)}
              isInvalid={!!error}
            />

            <Select
              label="Role (Optional)"
              name="role"
              placeholder="Select your role"
              variant="bordered"
              selectedKeys={formData.role ? [formData.role] : []}
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
              label="Password"
              name="password"
              placeholder="Create password (min 6 characters)"
              type={showPassword ? "text" : "password"}
              variant="bordered"
              value={formData.password}
              onValueChange={(value) => updateFormData("password", value)}
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

            <Input
              isRequired
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your password"
              type={showConfirmPassword ? "text" : "password"}
              variant="bordered"
              value={formData.confirmPassword}
              onValueChange={(value) =>
                updateFormData("confirmPassword", value)
              }
              isInvalid={!!error}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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

            <Button
              className="w-full"
              color="primary"
              type="submit"
              isLoading={isLoading}
              isDisabled={
                !formData.firstName ||
                !formData.lastName ||
                !formData.email ||
                !formData.password ||
                !formData.organization
              }
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
            Already have an account?{" "}
            <Link
              href="#"
              size="sm"
              className="cursor-pointer"
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
