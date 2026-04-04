"use client";

import { createContext, useCallback, useContext, useState } from "react";

type AuthTab = "login" | "signup";

interface AuthContextValue {
  open: boolean;
  tab: AuthTab;
  setTab: (tab: AuthTab) => void;
  openAuth: (tab?: AuthTab) => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<AuthTab>("login");

  const openAuth = useCallback((requestedTab?: AuthTab) => {
    setTab(requestedTab ?? "login");
    setOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <AuthContext value={{ closeAuth, open, openAuth, setTab, tab }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
