import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/products",
    element: <App />
  },
  {
    path: "/create-products",
    element: <App />
  },
  {
    path: "/expired-products",
    element: <App />
  },
  {
    path: "/low-stocks",
    element: <App />
  },
  {
    path: "/category",
    element: <App />
  },
  {
    path: "/sub-category",
    element: <App />
  },
  {
    path: "/brands",
    element: <App />
  },
  {
    path: "/manage-stock",
    element: <App />
  },
  {
    path: "/sales",
    element: <App />
  },
  {
    path: "/invoices",
    element: <App />
  },
  {
    path: "/discount",
    element: <App />
  },
  {
    path: "/customers",
    element: <App />
  },
  {
    path: "/employee",
    element: <App />
  },
  {
    path: "/reports",
    element: <App />
  },
  {
    path: "/settings",
    element: <App />
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </StrictMode>,
)


