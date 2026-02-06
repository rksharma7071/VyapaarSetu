import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { BsBox } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { TbUsersGroup } from "react-icons/tb";
import { AiOutlinePercentage, AiOutlineFile } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa6";
import { PiCaretDoubleLeftBold } from "react-icons/pi";

function SideBar() {
  const location = useLocation();

  const [menu, setMenu] = useState(() => {
    const stored = localStorage.getItem("menu");
    return stored !== null ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    localStorage.setItem("menu", JSON.stringify(menu));
  }, [menu]);

  const menuItems = [
    { label: "Dashboard", to: "/", icon: RxDashboard },
    { label: "Products", to: "/products", icon: BsBox },
    { label: "Orders", to: "/orders", icon: FiShoppingCart },
    { label: "Sales", to: "/sales", icon: FiShoppingCart },
    { label: "Invoices", to: "/invoices", icon: AiOutlineFile },
    { label: "Discount", to: "/discount", icon: AiOutlinePercentage },
    { label: "Customers", to: "/customers", icon: TbUsersGroup },
    { label: "Employee", to: "/employee", icon: FaRegUser },
    { label: "Reports", to: "/reports", icon: AiOutlineFile },
    { label: "Settings", to: "/settings", icon: IoSettingsOutline },
  ];

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
        {menuItems.map((item) => {
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
