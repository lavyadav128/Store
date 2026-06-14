// src/components/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const ADMIN_EMAIL = "adminbrand@gmail.com";

const AdminRoute = () => {
  const token    = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (!token)                    return <Navigate to="/"          replace />;
  if (username !== ADMIN_EMAIL)  return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default AdminRoute;