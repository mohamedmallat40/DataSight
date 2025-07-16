import { useState, useEffect } from "react";
import { LoginModal } from "./login-modal";
import { RegisterModal } from "./register-modal";

export function AuthProvider() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    const handleOpenLogin = () => {
      setIsLoginOpen(true);
      setIsRegisterOpen(false);
    };

    const handleOpenRegister = () => {
      setIsRegisterOpen(true);
      setIsLoginOpen(false);
    };

    // Listen for custom events
    window.addEventListener("openLogin", handleOpenLogin);
    window.addEventListener("openRegister", handleOpenRegister);

    return () => {
      window.removeEventListener("openLogin", handleOpenLogin);
      window.removeEventListener("openRegister", handleOpenRegister);
    };
  }, []);

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <>
      <LoginModal
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
}
