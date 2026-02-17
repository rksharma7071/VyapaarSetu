import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { applyTheme, loadTheme } from "./utils/theme.js";
import ApiLoader from "./components/ApiLoader.jsx";
import AlertProvider from "./components/UI/AlertProvider.jsx";

import "./index.css";
import App from "./App.jsx";
import { store } from "./store/index.js";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import CreateProducts from "./pages/CreateProducts.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import ExpiredProducts from "./pages/ExpiredProducts.jsx";
import LowStocks from "./pages/LowStocks.jsx";
import Category from "./pages/Category.jsx";
import SubCategory from "./pages/SubCategory.jsx";
import Brands from "./pages/Brands.jsx";
import ManageStock from "./pages/ManageStock.jsx";
import Sales from "./pages/Sales.jsx";
import Invoices from "./pages/Invoices.jsx";
import Discount from "./pages/Discount.jsx";
import Customers from "./pages/Customers.jsx";
import Employee from "./pages/Employee.jsx";
import RolePermissions from "./pages/RolePermissions.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";
import Order from "./pages/Order.jsx";
import OrderById from "./pages/OrderById.jsx";
import Suppliers from "./pages/Suppliers.jsx";
import PurchaseOrders from "./pages/PurchaseOrders.jsx";
import Returns from "./pages/Returns.jsx";
import ActivityLog from "./pages/ActivityLog.jsx";

// Auth
import Login from "./pages/Authentication/Login.jsx";
import Register from "./pages/Authentication/Register.jsx";
import ForgotPassword from "./pages/Authentication/ForgotPassword.jsx";
import EmailVerification from "./pages/Authentication/EmailVerification.jsx";
import ResetPassword from "./pages/Authentication/ResetPassword.jsx";
import Success from "./pages/Authentication/Success.jsx";
import Verification from "./pages/Authentication/Verification.jsx";
import ComingSoon from "./pages/Authentication/ComingSoon.jsx";
import Error404 from "./pages/Authentication/Error404.jsx";
import Error500 from "./pages/Authentication/Error500.jsx";
import UnderMaintenance from "./pages/Authentication/UnderMaintenance.jsx";

// POS
import POS from "./pages/POS.jsx";
import Checkout from "./components/POS/Checkout.jsx";
import Main from "./components/POS/Main.jsx";
import PosOrders from "./components/POS/Orders.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Pricing from "./pages/Pricing.jsx";
import StoreSetup from "./pages/StoreSetup.jsx";

// Loaders
import { getProductBySlug } from "./data/product.js";

const api = import.meta.env.VITE_API_URL || "http://localhost:3000";
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}

let refreshPromise = null;
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return Promise.reject(error);
      }
      try {
        if (!refreshPromise) {
          refreshPromise = axios.post(`${api}/auth/refresh`, { refreshToken });
        }
        const refreshRes = await refreshPromise;
        refreshPromise = null;
        const newToken = refreshRes.data.token;
        const newRefresh = refreshRes.data.refreshToken;
        localStorage.setItem("token", newToken);
        if (newRefresh) localStorage.setItem("refresh_token", newRefresh);
        axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        original.headers = {
          ...(original.headers || {}),
          Authorization: `Bearer ${newToken}`,
        };
        return axios(original);
      } catch (refreshError) {
        refreshPromise = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refresh_token");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
      { index: true, element: <Dashboard /> },

      { path: "products", element: <Products /> },
      {
        path: "products/:slug",
        element: <EditProduct />,
        loader: getProductBySlug,
      },
      { path: "create-products", element: <CreateProducts /> },

      { path: "orders", element: <Order /> },
      { path: "orders/:id", element: <OrderById /> },

      { path: "expired-products", element: <ExpiredProducts /> },
      { path: "low-stocks", element: <LowStocks /> },

      { path: "category", element: <Category /> },
      { path: "sub-category", element: <SubCategory /> },
      { path: "brands", element: <Brands /> },

      { path: "manage-stock", element: <ManageStock /> },
      { path: "sales", element: <Sales /> },
      { path: "discount", element: <Discount /> },
      { path: "suppliers", element: <Suppliers /> },
      { path: "purchase-orders", element: <PurchaseOrders /> },
      { path: "returns", element: <Returns /> },
      { path: "customers", element: <Customers /> },
      { path: "employee", element: <Employee /> },
      { path: "role-permissions", element: <RolePermissions /> },
      { path: "reports", element: <Reports /> },
      { path: "activity-log", element: <ActivityLog /> },
      { path: "settings", element: <Settings /> },
        ],
      },
      {
        path: "/pos",
        element: <Main />,
        children: [
          { index: true, element: <POS /> },
          { path: "orders", element: <PosOrders /> },
          { path: "checkout", element: <Checkout /> },
        ],
      },
    ],
  },

  { path: "/login", element: <Login /> },
  { path: "/store-setup", element: <StoreSetup /> },
  { path: "/pricing", element: <Pricing /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/email-verification", element: <EmailVerification /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/success", element: <Success /> },
  { path: "/verification", element: <Verification /> },
  { path: "/coming-soon", element: <ComingSoon /> },
  { path: "/under-maintenance", element: <UnderMaintenance /> },
  { path: "/500", element: <Error500 /> },
  { path: "*", element: <Error404 /> },
]);

applyTheme(loadTheme());

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AlertProvider>
        <ApiLoader />
        <RouterProvider router={router} ></RouterProvider>
      </AlertProvider>
    </Provider>
  </StrictMode >
);
