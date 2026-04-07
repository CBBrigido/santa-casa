import { createContext, useContext, useState, ReactNode } from "react";

type Role = "admin" | "doctor";

interface RoleContextType {
  role: Role;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType>({ role: "admin", toggleRole: () => {} });

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("admin");
  const toggleRole = () => setRole((r) => (r === "admin" ? "doctor" : "admin"));
  return <RoleContext.Provider value={{ role, toggleRole }}>{children}</RoleContext.Provider>;
}

export const useRole = () => useContext(RoleContext);
