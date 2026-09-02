import React, { createContext, useContext, useState, useEffect } from "react";
import { initUserSession, clearActiveSession } from "../data/financialStore";

const AuthContext = createContext();

export const DEFAULT_DEMO_USER = {
  id: "usr_ceo",
  name: "Lakshay Rajput",
  email: "ceo@bharatprecision.in",
  phone: "+91 98201 44521",
  role: "CEO",
  company: "Precision Auto Gears Ltd",
  businessId: "biz_usr_ceo",
  avatar: "LR",
};

export function AuthProvider({ children }) {
  // Initialize with active user session (saved or default demo enterprise)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("fintwin_auth_user");
      if (saved) return JSON.parse(saved);
      const isLoggedOut = localStorage.getItem("fintwin_logged_out");
      if (isLoggedOut === "true") return null;
      return DEFAULT_DEMO_USER;
    } catch (e) {
      return DEFAULT_DEMO_USER;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("fintwin_auth_user", JSON.stringify(user));
      localStorage.removeItem("fintwin_logged_out");
      initUserSession(user);
    } else {
      localStorage.removeItem("fintwin_auth_user");
      clearActiveSession();
    }
  }, [user]);

  const login = (identifier, password, role = "CEO") => {
    const raw = (identifier || "").trim();
    const isEmail = raw.includes("@");
    const isPhone = /^[0-9+ -]{7,15}$/.test(raw);

    const cleanId = raw.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const userId = `usr_${cleanId || "user"}`;
    const businessId = `biz_${userId}`;

    let displayName = "Business Owner";
    let email = isEmail ? raw.toLowerCase() : "";
    let phone = !isEmail ? raw : "";

    if (isEmail) {
      const cleanName = raw.split("@")[0].replace(/[._]/g, " ");
      displayName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    } else if (isPhone) {
      displayName = `User (${raw.slice(-4)})`;
    }

    const loggedUser = {
      id: userId,
      name: displayName,
      email: email,
      phone: phone,
      role: role || "CEO",
      company: `${displayName}'s Enterprise`,
      businessId: businessId,
      avatar: displayName.substring(0, 2).toUpperCase(),
    };

    try {
      localStorage.setItem("fintwin_auth_user", JSON.stringify(loggedUser));
    } catch (e) {
      console.warn("Error storing user session:", e);
    }
    initUserSession(loggedUser);
    setUser(loggedUser);
    return { success: true, user: loggedUser };
  };

  const register = ({ name, email, phone, company, gstin, industry, role = "CEO" }) => {
    const rawIdentifier = (email || phone || name || "user").trim();
    const cleanId = rawIdentifier.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const userId = `usr_${cleanId}`;
    const businessId = `biz_${userId}`;

    const newUser = {
      id: userId,
      name: name || "Business Owner",
      email: (email || "").toLowerCase(),
      phone: phone || "",
      company: company || "My Enterprise",
      industry: industry || "Manufacturing & Heavy Engineering",
      gstin: gstin || "",
      role: role || "CEO",
      businessId: businessId,
      avatar: name ? name.substring(0, 2).toUpperCase() : "ME",
    };

    try {
      localStorage.setItem("fintwin_auth_user", JSON.stringify(newUser));
    } catch (e) {
      console.warn("Error storing user session:", e);
    }
    initUserSession(newUser);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    try {
      localStorage.removeItem("fintwin_auth_user");
      localStorage.setItem("fintwin_logged_out", "true");
    } catch (e) {
      console.warn("Error removing auth token:", e);
    }
    setUser(null);
    clearActiveSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
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
