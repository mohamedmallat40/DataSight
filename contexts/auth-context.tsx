"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/router";

interface User {
  email: string;
  name: string;
  loginTime: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials
const DEMO_EMAIL = "demo@sultan.sa";
const DEMO_PASSWORD = "demo@sultan.sa";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for existing session on mount
    const checkExistingSession = () => {
      try {
        const token = localStorage.getItem("auth_token");
        const userSession = localStorage.getItem("user_session");

        if (token && userSession) {
          const userData = JSON.parse(userSession);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        // Clear invalid session data
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_session");
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate demo credentials
      if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
        return {
          success: false,
          error:
            "Invalid credentials. Use demo@sultan.sa for both email and password.",
        };
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create user session
      const userData: User = {
        email: DEMO_EMAIL,
        name: "Demo User",
        loginTime: new Date().toISOString(),
      };

      // Store in localStorage
      localStorage.setItem("auth_token", `demo-token-${Date.now()}`);
      localStorage.setItem("user_session", JSON.stringify(userData));

      // Update state
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Login failed. Please try again.",
      };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_session");

    // Clear state
    setUser(null);

    // Redirect to home page
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
