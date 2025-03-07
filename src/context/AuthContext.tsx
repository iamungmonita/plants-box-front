"use client";

import API_URL from "@/lib/api";
import { Profile } from "@/schema/auth";
import { getAdminProfile, SignOut } from "@/services/authentication";
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
  isAuthorized: (profileRoles?: string[], roleCodes?: string[]) => boolean; // Check if user has the required role

  signOut: () => void;
  onRefresh: () => void;
  profile: Profile | null;
  message: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  const isAuthorized = (
    profileRoles?: string[],
    roleCodes?: string[]
  ): boolean => {
    // If neither profileRoles nor roleCodes are provided, deny access
    if (!profileRoles && !roleCodes) {
      return true; // Allowing everyone might not be what you want
    }

    // If profileRoles is provided but roleCodes is missing, deny access
    if (profileRoles && !roleCodes) {
      return false;
    }

    // If roleCodes is provided, check if any roleCode in profileRoles matches
    if (roleCodes && roleCodes.length > 0 && profileRoles) {
      return profileRoles.some((roleCode) => roleCodes.includes(roleCode));
    }

    // If profileRoles is missing, but roleCodes is provided, allow access
    if (!profileRoles && roleCodes && roleCodes.length > 0) {
      return true; // This allows access if roleCodes are provided but no profileRoles
    }

    // Default to false if no roleCodes provided, deny access
    return true;
  };

  const fetchProfile = async (abortController: AbortController) => {
    try {
      const response = await getAdminProfile(abortController);
      if (response.data) {
        setIsAuthenticated(true);
        setProfile(response.data);
      } else if (response.name && response.message) {
        setProfile(null);
        setIsAuthenticated(false);
        setMessage(response.message);
      } else {
        console.log(response.message);
      }
    } catch (error: unknown) {
      // Type assertion to ensure it's an instance of Error
      if (error instanceof Error) {
        if (error.name !== "AbortError") {
          // Handle non-abort errors here
          console.error("Error fetching profile:", error.message);
        } else {
          // Handle abort error separately
          console.log("Request was aborted.");
        }
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = getAccessToken();
    if (accessToken) {
      const abortController = new AbortController();
      fetchProfile(abortController);
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

  const signOut = async () => {
    try {
      await SignOut();
      setIsAuthenticated(false);
      setProfile(null);
      setMessage(null);
    } catch (err) {
      console.log("Error signing out", err);
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
      value={{
        isAuthenticated,
        isAuthorized,
        signIn,
        signUp,
        signOut,
        onRefresh,
        profile,
        message,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
