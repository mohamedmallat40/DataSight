"use client";

import React, { createContext, useContext, useState } from "react";

import LoginModal from "./login-modal";
import RegisterModal from "./register-modal";

interface AuthContextType {
  openLogin: () => void;
  openRegister: () => void;
  closeModals: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  // Listen for global events to open modals
  React.useEffect(() => {
    const handleTriggerLogin = () => openLogin();
    const handleTriggerRegister = () => openRegister();

    window.addEventListener("openLogin", handleTriggerLogin);
    window.addEventListener("openRegister", handleTriggerRegister);

    return () => {
      window.removeEventListener("openLogin", handleTriggerLogin);
      window.removeEventListener("openRegister", handleTriggerRegister);
    };
  }, [openLogin, openRegister]);

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <AuthContext.Provider value={{ openLogin, openRegister, closeModals }}>
      {children}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeModals}
        onSwitchToRegister={switchToRegister}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={closeModals}
        onSwitchToLogin={switchToLogin}
      />
    </AuthContext.Provider>
  );
}
