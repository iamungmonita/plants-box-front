"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context's shape
interface TitleContextType {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

// Create context with a default value
const TitleContext = createContext<TitleContextType | undefined>(undefined);

// Custom hook to access the context
export const useTitleContext = () => {
  const context = useContext(TitleContext);
  if (!context) {
    throw new Error("useTitleContext must be used within a TitleProvider");
  }
  return context;
};

// TitleProvider component
export const TitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState<string>("");

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};
