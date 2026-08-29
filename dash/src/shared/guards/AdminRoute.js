// src/components/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const ADMIN_EMAIL = "adminbrand@gmail.com";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email") || localStorage.getItem("username");

  if (!token)                  return <Navigate to="/"          replace />;
  if (email !== ADMIN_EMAIL)   return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default AdminRoute;