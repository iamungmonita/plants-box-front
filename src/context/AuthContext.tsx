"use client";

import { Profile } from "@/models/Auth";
import { getAdminProfile } from "@/services/authentication";
import { getAccessToken } from "@/utils/localStroage";
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  const isAuthorized = (
    profileRoles?: string[],
    roleCodes?: string[]
  ): boolean => {
    if (!profileRoles && !roleCodes) {
      return true;
    }
    if (profileRoles && !roleCodes) {
      return false;
    }
    if (roleCodes && roleCodes.length > 0 && profileRoles) {
      return profileRoles.some((roleCode) => roleCodes.includes(roleCode));
    }
    if (!profileRoles && roleCodes && roleCodes.length > 0) {
      return true;
    }
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
        setProfile(null);
        setIsAuthenticated(false);
        setMessage(response.message ?? "Error fetching profile");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching profile:", error.message);
        } else {
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
      const authTokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN || "auth_token";
      localStorage.removeItem(authTokenKey);
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
