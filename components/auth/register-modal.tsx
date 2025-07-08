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

  const roles = [
    "Doctor",
    "Nurse",
    "Administrator",
    "Manager",
    "Receptionist",
    "Other",
  ];

  const handleRegister = async () => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      organization,
    } = formData;

    if (!firstName || !lastName || !email || !password || !organization) {
      alert("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, store a fake token
      localStorage.setItem("auth_token", "demo-token-" + Date.now());
      localStorage.setItem(
        "user_session",
        JSON.stringify({
          email,
          name: `${firstName} ${lastName}`,
          organization,
          role: formData.role || "User",
          registrationTime: new Date().toISOString(),
        }),
      );

      // Close modal and trigger auth state update
      onOpenChange(false);
      window.location.reload(); // Simple way to update auth state
    } catch (error) {
      console.error("Registration failed:", error);
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
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-sm text-default-500">
            Join All Care Medical Group
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                autoFocus
                label="First Name"
                placeholder="Enter first name"
                variant="bordered"
                value={formData.firstName}
                onValueChange={(value) => updateFormData("firstName", value)}
                startContent={
                  <Icon
                    icon="lucide:user"
                    className="text-default-400"
                    width={18}
                  />
                }
              />
              <Input
                label="Last Name"
                placeholder="Enter last name"
                variant="bordered"
                value={formData.lastName}
                onValueChange={(value) => updateFormData("lastName", value)}
              />
            </div>

            <Input
              label="Email"
              placeholder="Enter your email"
              variant="bordered"
              type="email"
              value={formData.email}
              onValueChange={(value) => updateFormData("email", value)}
              startContent={
                <Icon
                  icon="lucide:mail"
                  className="text-default-400"
                  width={18}
                />
              }
            />

            <Input
              label="Organization"
              placeholder="Enter your organization"
              variant="bordered"
              value={formData.organization}
              onValueChange={(value) => updateFormData("organization", value)}
              startContent={
                <Icon
                  icon="lucide:building"
                  className="text-default-400"
                  width={18}
                />
              }
            />

            <Select
              label="Role (Optional)"
              placeholder="Select your role"
              variant="bordered"
              value={formData.role}
              onValueChange={(value) => updateFormData("role", value)}
            >
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Password"
              placeholder="Create password (min 6 characters)"
              variant="bordered"
              value={formData.password}
              onValueChange={(value) => updateFormData("password", value)}
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

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              variant="bordered"
              value={formData.confirmPassword}
              onValueChange={(value) =>
                updateFormData("confirmPassword", value)
              }
              type={showConfirmPassword ? "text" : "password"}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none"
                >
                  <Icon
                    icon={showConfirmPassword ? "lucide:eye-off" : "lucide:eye"}
                    className="text-default-400 hover:text-default-600"
                    width={18}
                  />
                </button>
              }
            />
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-col gap-3">
          <Button
            color="primary"
            isLoading={isLoading}
            onPress={handleRegister}
            className="w-full"
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
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              size="sm"
              className="cursor-pointer"
              onClick={() => {
                handleClose();
                onSwitchToLogin();
              }}
            >
              Sign in
            </Link>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
