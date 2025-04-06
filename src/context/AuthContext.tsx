"use client";

import { Profile } from "@/models/Auth";
import { getAdminProfile } from "@/services/authentication";
import { getAccessToken } from "@/utils/localStroage";
import { usePathname, useRouter } from "next/navigation";
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
  isAuthorized: (roleCodes?: string[], profileRoles?: string[]) => boolean; // Check if user has the required role
  getRouteAuthorization: (
    roleCodes?: string[],
    profileRoles?: string[]
  ) => boolean; // Check if user has the required role

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
  const pathname = usePathname();
  const router = useRouter();

  const isAuthorized = (
    roleCodes?: string[],
    profileRoles?: string[]
  ): boolean => {
    if (!profileRoles && !roleCodes) {
      return true;
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
    } catch (error) {
      signOut();
      console.log("hi this is error: ", error);
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
    router.push("/auth/sign-in");
  }, [isRefresh, pathname]);

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
      router.push("/auth/sign-in");
    } catch (err) {
      console.log("Error signing out", err);
    }
  };

  const getRouteAuthorization = (
    roleCodes?: string[],
    profileRoles?: string[]
  ): boolean => {
    const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN || "auth_token";
    const token = localStorage.getItem(tokenKey);
    const allowed = isAuthorized(roleCodes, profileRoles);
    return !!token && allowed;
  };
  const onRefresh = useCallback(() => {
    setIsRefresh((prev) => !prev);
  }, [pathname]);

  if (isLoading) {
    return <></>;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthorized,
        getRouteAuthorization,
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
