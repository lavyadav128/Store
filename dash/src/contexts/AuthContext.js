

import axios from "axios";
import httpStatus from "http-status";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: server,
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const router = useNavigate();

  /* 🔁 COMMON REDIRECT LOGIC */
  const redirectUser = (username) => {
    if (username === "adminbrand") {
      router("/admin-dashboard");
    } else {
      router("/dashboard");
    }
  };

  /* ---------------- REGISTER ---------------- */
  const handleRegister = async (name, username, password) => {
    try {
      const res = await client.post("/api/register", {
        name,
        username,
        password,
      });

      if (res.status === httpStatus.CREATED) {
        const { token, username: registeredUsername } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("username", registeredUsername);

        redirectUser(registeredUsername);

        return res.data.message;
      }
    } catch (err) {
      throw err;
    }
  };

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async (username, password) => {
    try {
      const res = await client.post("/api/login", {
        username,
        password,
      });

      if (res.status === httpStatus.OK) {
        const { token, username: loggedInUsername } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("username", loggedInUsername);

        redirectUser(loggedInUsername);
      }
    } catch (err) {
      throw err;
    }
  };

  /* ---------------- AXIOS INTERCEPTOR ---------------- */
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return (
    <AuthContext.Provider
      value={{
        setUserData,
        handleRegister,
        handleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

