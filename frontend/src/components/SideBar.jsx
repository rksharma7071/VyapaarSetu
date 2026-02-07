import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { BsBox } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { TbUsersGroup } from "react-icons/tb";
import { AiOutlinePercentage, AiOutlineFile } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa6";
import { PiCaretDoubleLeftBold } from "react-icons/pi";
import axios from "axios";
import { API_URL } from "../utils/api";

function SideBar() {
  const location = useLocation();
  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "null"), []);
  const [permission, setPermission] = useState(null);

  const [menu, setMenu] = useState(() => {
    const stored = localStorage.getItem("menu");
    return stored !== null ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    localStorage.setItem("menu", JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    if (!user?.id) return;
    if (user?.role === "admin") return setPermission({ admin: true });
    axios
      .get(`${API_URL}/user/permission/${user.id}`)
      .then((res) => setPermission(res.data || {}))
      .catch(() => setPermission({}));
  }, [user]);

  const menuItems = [
    { label: "Dashboard", to: "/", icon: RxDashboard, perm: "readReport" },
    { label: "Products", to: "/products", icon: BsBox, perm: "readProduct" },
    { label: "Categories", to: "/category", icon: BsBox, perm: "readProduct" },
    { label: "Brands", to: "/brands", icon: BsBox, perm: "readProduct" },
    { label: "Orders", to: "/orders", icon: FiShoppingCart, perm: "readOrder" },
    { label: "Sales", to: "/sales", icon: FiShoppingCart, perm: "readOrder" },
    { label: "Invoices", to: "/invoices", icon: AiOutlineFile, perm: "readInvoice" },
    { label: "Discount", to: "/discount", icon: AiOutlinePercentage, perm: "readDiscount" },
    { label: "Suppliers", to: "/suppliers", icon: TbUsersGroup, perm: "readSupplier" },
    { label: "Purchase Orders", to: "/purchase-orders", icon: AiOutlineFile, perm: "readPurchaseOrder" },
    { label: "Manage Stock", to: "/manage-stock", icon: BsBox, perm: "readInventory" },
    { label: "Low Stock", to: "/low-stocks", icon: BsBox, perm: "readInventory" },
    { label: "Expired", to: "/expired-products", icon: BsBox, perm: "readInventory" },
    { label: "Returns", to: "/returns", icon: FiShoppingCart, perm: "readReturn" },
    { label: "Customers", to: "/customers", icon: TbUsersGroup, perm: "readCustomer" },
    { label: "Employee", to: "/employee", icon: FaRegUser, perm: "readUser" },
    { label: "Reports", to: "/reports", icon: AiOutlineFile, perm: "readReport" },
    { label: "Settings", to: "/settings", icon: IoSettingsOutline, perm: "readUser" },
  ];

  const canSee = (item) => {
    if (!permission) return false;
    if (permission.admin) return true;
    return permission[item.perm];
  };

  return (
    <aside
      className={`relative hidden md:flex md:flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${menu ? "w-64 min-w-[12rem]" : "w-16 min-w-[4rem]"}`}
    >
      {/* LOGO */}
      <Link
        to="/"
        className="flex h-20 items-center justify-center border-b border-gray-300"
      >
        <img
          src={menu ? "/logo.png" : "/favicon.png"}
          alt="Logo"
          className="h-12 w-auto object-contain transition-all duration-300"
        />
      </Link>

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setMenu((prev) => !prev)}
        className={`absolute top-24 -right-3 z-10 flex items-center justify-center rounded-full bg-primary p-1.5 text-white shadow-md transition-transform duration-300  ${menu ? "rotate-0" : "rotate-180"}`}
      >
        <PiCaretDoubleLeftBold />
      </button>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {menuItems.filter(canSee).map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <NavLink
              key={item.label}
              to={item.to}
              title={!menu ? item.label : ""}
              className={() =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
              }
            >
              <item.icon className="text-lg shrink-0" />
              <span
                className={`whitespace-nowrap transition-all duration-200 ${menu ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default SideBar;
