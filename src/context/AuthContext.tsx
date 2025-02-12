"use client";

import { getAccessToken } from "@/utils/Cookie";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  signIn: () => void;
  signUp: () => void;
  signOut: () => void;
  onRefresh: () => void;
  profile: Profile | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export interface Profile {
  createdAt: string;
  email: string;
  password: string;
  updatedAt: string;
  username: string;
  __v: number;
  _id: string;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  useEffect(() => {
    const accessToken = getAccessToken();
    if (accessToken) {
      const abortController = new AbortController();
      getAdminProfile(abortController);
      return () => abortController.abort();
    }
    setIsLoading(false);
  }, [isRefresh]);

  const signIn = () => {
    setIsAuthenticated(true);
  };
  const signUp = () => {
    setIsAuthenticated(true);
  };

  const signOut = () => {
    fetch("http://localhost:4002/auth/signout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setIsAuthenticated(false);
    });
  };

  const getAdminProfile = async (abortController: AbortController) => {
    try {
      const response = await fetch("http://localhost:4002/auth/profile", {
        method: "GET",
        credentials: "include",
        signal: abortController.signal,
      });

      if (!response.ok) {
        setIsAuthenticated(false);
        setProfile(null);
        throw new Error(response.statusText);
      } else {
        const result = await response.json();
        setIsAuthenticated(true);
        setProfile(result.admin);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setIsRefresh((prev) => !prev);
  }, []);

  if (isLoading) {
    return <></>;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, signIn, signUp, signOut, onRefresh, profile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
