import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Products from './pages/Products.jsx'
import CreateProducts from './pages/CreateProducts.jsx'
import ExpiredProducts from './pages/ExpiredProducts.jsx'
import LowStocks from './pages/LowStocks.jsx'
import Category from './pages/Category.jsx'
import SubCategory from './pages/SubCategory.jsx'
import Brands from './pages/Brands.jsx'
import ManageStock from './pages/ManageStock.jsx'
import Sales from './pages/Sales.jsx'
import Invoices from './pages/Invoices.jsx'
import Discount from './pages/Discount.jsx'
import Customers from './pages/Customers.jsx'
import Employee from './pages/Employee.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Authentication/Login.jsx'
import Register from './pages/Authentication/Register.jsx'
import ForgotPassword from './pages/Authentication/ForgotPassword.jsx'
import EmailVerification from './pages/Authentication/EmailVerification.jsx'
import ResetPassword from './pages/Authentication/ResetPassword.jsx'
import Success from './pages/Authentication/Success.jsx'
import Verification from './pages/Authentication/Verification.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: "/products",
        element: <Products />
      },
      {
        path: "/create-products",
        element: <CreateProducts />
      },
      {
        path: "/expired-products",
        element: <ExpiredProducts />
      },
      {
        path: "/low-stocks",
        element: <LowStocks />
      },
      {
        path: "/category",
        element: <Category />
      },
      {
        path: "/sub-category",
        element: <SubCategory />
      },
      {
        path: "/brands",
        element: <Brands />
      },
      {
        path: "/manage-stock",
        element: <ManageStock />
      },
      {
        path: "/sales",
        element: <Sales />
      },
      {
        path: "/invoices",
        element: <Invoices />
      },
      {
        path: "/discount",
        element: <Discount />
      },
      {
        path: "/customers",
        element: <Customers />
      },
      {
        path: "/employee",
        element: <Employee />
      },
      {
        path: "/reports",
        element: <Reports />
      },
      {
        path: "/settings",
        element: <Settings />
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/email-verification",
    element: <EmailVerification />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  },
  {
    path: "/success",
    element: <Success />
  },
  {
    path: "/verification",
    element: <Verification />
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </StrictMode>,
)


