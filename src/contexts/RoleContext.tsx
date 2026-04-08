import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

type Role = "admin" | "doctor";

interface RoleContextType {
  role: Role;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType>({ role: "admin", toggleRole: () => {} });

export function RoleProvider({ children }: { children: ReactNode }) {
  // Role é gerenciado pelo AuthContext
  return <RoleContext.Provider value={{ role: "admin", toggleRole: () => {} }}>{children}</RoleContext.Provider>;
}

export const useRole = () => {
  const { role } = useAuth();
  return { role, toggleRole: () => {} };
};
