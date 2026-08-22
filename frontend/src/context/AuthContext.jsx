import React, { createContext, useContext, useState, useEffect } from "react";
import { switchBusinessProfile } from "../data/financialStore";

const AuthContext = createContext();

const DEMO_USERS = {
  founder: {
    id: "USR-001",
    name: "Lakshay Rajput",
    email: "lakshay@abcmfg.in",
    role: "Founder & CEO",
    company: "ABC Manufacturing",
    businessId: "BUS-001",
    avatar: "LR",
  },
  cfo: {
    id: "USR-002",
    name: "Ananya Sharma",
    email: "ananya.cfo@zenithlogistics.com",
    role: "Chief Financial Officer (CFO)",
    company: "Zenith Retail & Logistics",
    businessId: "BUS-002",
    avatar: "AS",
  },
  accountant: {
    id: "USR-003",
    name: "Vikram Mehta",
    email: "vikram@apexengg.com",
    role: "Financial Controller",
    company: "Apex Engineering & Tech",
    businessId: "BUS-003",
    avatar: "VM",
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("fintwin_auth_user");
      return saved ? JSON.parse(saved) : DEMO_USERS.founder;
    } catch (e) {
      return DEMO_USERS.founder;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("fintwin_auth_user", JSON.stringify(user));
      if (user.businessId) {
        switchBusinessProfile(user.businessId);
      }
    } else {
      localStorage.removeItem("fintwin_auth_user");
    }
  }, [user]);

  const login = (email, password) => {
    // Check demo match or create session
    const matched = Object.values(DEMO_USERS).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (matched) {
      setUser(matched);
      return { success: true, user: matched };
    }

    const customUser = {
      id: `USR-${Date.now()}`,
      name: email.split("@")[0].toUpperCase(),
      email,
      role: "Finance Admin",
      company: "My Business",
      businessId: "BUS-001",
      avatar: email.substring(0, 2).toUpperCase(),
    };
    setUser(customUser);
    return { success: true, user: customUser };
  };

  const register = ({ name, email, company, gstin, role }) => {
    const newUser = {
      id: `USR-${Date.now()}`,
      name,
      email,
      company: company || "My Enterprise",
      gstin: gstin || "27AABCA1234F1Z8",
      role: role || "Managing Director",
      businessId: "BUS-001",
      avatar: name ? name.substring(0, 2).toUpperCase() : "ME",
    };
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const switchDemoRole = (roleKey) => {
    if (DEMO_USERS[roleKey]) {
      setUser(DEMO_USERS[roleKey]);
      switchBusinessProfile(DEMO_USERS[roleKey].businessId);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchDemoRole,
        DEMO_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
