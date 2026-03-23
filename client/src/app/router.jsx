import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "../components/common/Layout";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { FarmerDashboard } from "../pages/FarmerDashboard";
import { FarmerOrderDetails } from "../pages/FarmerOrderDetails";
import { BuyerDashboard } from "../pages/BuyerDashboard";
import { AdminDashboard } from "../pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "farmer", element: <FarmerDashboard /> },
      { path: "farmer/orders/:buyerSlug/:orderId", element: <FarmerOrderDetails /> },
      { path: "buyer", element: <BuyerDashboard /> },
      { path: "admin", element: <AdminDashboard /> },
      { path: "*", element: <Navigate to="/" replace /> }
    ]
  }
]);


