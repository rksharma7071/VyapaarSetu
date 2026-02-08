import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";

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

// Auth
import Login from "./pages/Authentication/Login.jsx";
import Register from "./pages/Authentication/Register.jsx";
import ForgotPassword from "./pages/Authentication/ForgotPassword.jsx";
import EmailVerification from "./pages/Authentication/EmailVerification.jsx";
import ResetPassword from "./pages/Authentication/ResetPassword.jsx";
import Success from "./pages/Authentication/Success.jsx";
import Verification from "./pages/Authentication/Verification.jsx";

// POS
import POS from "./pages/POS.jsx";
import Checkout from "./components/POS/Checkout.jsx";
import Main from "./components/POS/Main.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Pricing from "./pages/Pricing.jsx";
import StoreSetup from "./pages/StoreSetup.jsx";

// Loaders
import { getProductBySlug } from "./data/product.js";

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
      { path: "invoices", element: <Invoices /> },
      { path: "discount", element: <Discount /> },
      { path: "suppliers", element: <Suppliers /> },
      { path: "purchase-orders", element: <PurchaseOrders /> },
      { path: "returns", element: <Returns /> },
      { path: "customers", element: <Customers /> },
      { path: "employee", element: <Employee /> },
      { path: "role-permissions", element: <RolePermissions /> },
      { path: "reports", element: <Reports /> },
      { path: "settings", element: <Settings /> },
        ],
      },
      {
        path: "/pos",
        element: <Main />,
        children: [
          { index: true, element: <POS /> },
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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} ></RouterProvider>
    </Provider>
  </StrictMode >
);
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}
