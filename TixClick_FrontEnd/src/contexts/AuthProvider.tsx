import React, { createContext, useEffect, useState } from "react";
import { toast } from "sonner";
import axiosClient from "../services/axiosClient";

type Props = {
  children: React.ReactNode;
};

interface AuthInterface {
  isLogin: boolean;
  isSuperLogin: boolean;
  login: (token: string, role: string) => void;
  superLogin: (token: string) => void;
  logout: () => void;
  accessToken: string | null;
  role: string | undefined;
  setTokenForAxios: (tokenType: "user" | "super", token: string) => void;
}

const AuthContext = createContext<AuthInterface | undefined>(undefined);

const AuthProvider = ({ children }: Props) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isSuperLogin, setIsSuperLogin] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [accessToken2, setAccessToken2] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [role, setRole] = useState<string | undefined>(localStorage.getItem("roleName") || undefined);

  // Kiểm tra token khi load trang
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedRole = localStorage.getItem("roleName");

    if (token) {
      setIsLogin(true);
      setAccessToken(token);
      setIsSuperLogin(true);
      setAccessToken2(token);
    }

    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const setTokenForAxios = (tokenType: "user" | "super", token: string) => {
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const login = (token: string, role: string) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("roleName", role);
    setIsLogin(true);
    setAccessToken(token);
    setRole(role);
  };

  const superLogin = (token: string) => {
    localStorage.setItem("accessToken", token);
    setIsSuperLogin(true);
    setAccessToken2(token);
  };

  const logout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("roleName");
    delete axiosClient.defaults.headers.common["Authorization"];
    setAccessToken(null);
    setAccessToken2(null);
    setIsLogin(false);
    setIsSuperLogin(false);
    setRole(undefined);
    toast.success("Đăng xuất thành công");
  };

  const value: AuthInterface = {
    accessToken,
    isLogin,
    isSuperLogin,
    role,
    login,
    superLogin,
    logout,
    setTokenForAxios,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };

