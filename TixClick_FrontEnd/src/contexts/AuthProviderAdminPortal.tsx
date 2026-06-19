// import React, { createContext, useEffect, useState } from "react";
// import axiosClient from "../services/axiosClient";

// type Props = {
//   children: React.ReactNode;
// };

// interface AuthInterface {
//   isLogin: boolean;
//   login: (token: string) => void;
//   accessTokenAdminPortal: string | null;
// }

// const AuthContextAdminPortal = createContext<AuthInterface | undefined>(undefined);

// const AuthProviderAdminPortal = ({ children }: Props) => {
//   const [isLogin, setIsLogin] = useState<boolean>(false);
//   const [accessTokenAdminPortal, setAccessTokenAdminPortal] = useState<string | null>(
//     localStorage.getItem("accessToken")
//   );
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       setIsLogin(true);
//       setAccessTokenAdminPortal(token);
//       axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     }
//   }, [isLogin, accessTokenAdminPortal]);

//   const login = (token: string) => {
//     setIsLogin(true);
//     setAccessTokenAdminPortal(token);
//     localStorage.setItem("accessToken", token);
//     axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   };

//   const value = {
//     accessTokenAdminPortal,
//     isLogin,
//     login,
//   };
//   return <AuthContextAdminPortal.Provider value={value}>{children}</AuthContextAdminPortal.Provider>;
// };

// export { AuthContextAdminPortal, AuthProviderAdminPortal };

