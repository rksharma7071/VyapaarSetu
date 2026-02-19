import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { BsBox } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlinePercentage } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { PiCaretDoubleLeftBold } from "react-icons/pi";
import { FaChevronDown } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { MdOutlineBrandingWatermark, MdOutlinePointOfSale, MdOutlineAssignmentReturn, MdOutlineInventory2, MdOutlineWarningAmber, MdOutlineEventBusy, MdOutlinePeopleAlt, MdOutlineGroups, MdOutlineAdminPanelSettings, MdOutlineAssessment, MdOutlineHistory } from "react-icons/md";
import { RiTruckLine, RiFileList3Line } from "react-icons/ri";
import axios from "axios";
import { API_URL } from "../utils/api";

function SideBar() {
  const location = useLocation();
  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "null"), []);
  const [permission, setPermission] = useState(null);
  const [openGroups, setOpenGroups] = useState({
    catalog: false,
    sales: false,
    inventory: false,
    operations: false,
    management: false,
    system: false,
  });

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
    let isMounted = true;
    const fetchPermission = () => {
      axios
        .get(`${API_URL}/user/permission/${user.id}`)
        .then((res) => {
          if (isMounted) setPermission(res.data || {});
        })
        .catch(() => {
          if (isMounted) setPermission({});
        });
    };
    fetchPermission();
    const interval = setInterval(fetchPermission, 60000);
    const onFocus = () => fetchPermission();
    window.addEventListener("focus", onFocus);
    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [user]);

  const menuItems = [
    { label: "Dashboard", to: "/", icon: RxDashboard, perm: "readReport" },
  ];

  const groupedItems = [
    {
      id: "catalog",
      label: "Catalog",
      items: [
        { label: "Products", to: "/products", icon: BsBox, perm: "readProduct" },
        { label: "Categories", to: "/category", icon: BiCategoryAlt, perm: "readProduct" },
        { label: "Brands", to: "/brands", icon: MdOutlineBrandingWatermark, perm: "readProduct" },
      ],
    },
    {
      id: "sales",
      label: "Sales",
      items: [
        { label: "Orders", to: "/orders", icon: FiShoppingCart, perm: "readOrder" },
        { label: "Sales", to: "/sales", icon: MdOutlinePointOfSale, perm: "readOrder" },
        { label: "Returns", to: "/returns", icon: MdOutlineAssignmentReturn, perm: "readReturn" },
      ],
    },
    {
      id: "inventory",
      label: "Inventory",
      items: [
        { label: "Manage Stock", to: "/manage-stock", icon: MdOutlineInventory2, perm: "readInventory" },
        { label: "Low Stock", to: "/low-stocks", icon: MdOutlineWarningAmber, perm: "readInventory" },
        { label: "Expired", to: "/expired-products", icon: MdOutlineEventBusy, perm: "readInventory" },
      ],
    },
    {
      id: "operations",
      label: "Operations",
      items: [
        { label: "Discount", to: "/discount", icon: AiOutlinePercentage, perm: "readDiscount" },
        { label: "Suppliers", to: "/suppliers", icon: RiTruckLine, perm: "readSupplier" },
        { label: "Purchase Orders", to: "/purchase-orders", icon: RiFileList3Line, perm: "readPurchaseOrder" },
        { label: "Customers", to: "/customers", icon: MdOutlinePeopleAlt, perm: "readCustomer" },
      ],
    },
    {
      id: "management",
      label: "Management",
      items: [
        { label: "Employee", to: "/employee", icon: MdOutlineGroups, perm: "readUser" },
        { label: "Role Permissions", to: "/role-permissions", icon: MdOutlineAdminPanelSettings, perm: "admin" },
      ],
    },
    {
      id: "system",
      label: "System",
      items: [
        { label: "Reports", to: "/reports", icon: MdOutlineAssessment, perm: "readReport" },
        { label: "Activity Log", to: "/activity-log", icon: MdOutlineHistory, perm: "readReport" },
        { label: "Settings", to: "/settings", icon: IoSettingsOutline, perm: "readUser" },
      ],
    },
  ];

  const canSee = (item) => {
    if (!permission) return false;
    if (permission.admin) return true;
    if (item.perm === "admin") return false;
    return permission[item.perm];
  };

  const toggleGroup = (id) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside
      className={`relative hidden md:flex md:flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${menu ? "w-64 min-w-[12rem]" : "w-16 min-w-[4rem]"}`}
    >
      {/* LOGO */}
      <Link
        to="/"
        className="flex h-20 items-center justify-center border-b border-gray-200"
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

        {groupedItems.map((group) => {
          const visibleItems = group.items.filter(canSee);
          if (!visibleItems.length) return null;
          const isOpen = openGroups[group.id];
          return (
            <div key={group.id} className="pt-1">
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:bg-gray-50"
              >
                <span className={`${menu ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                  {group.label}
                </span>
                <FaChevronDown
                  className={`text-[10px] transition ${isOpen ? "rotate-0" : "-rotate-90"} ${menu ? "opacity-100" : "opacity-100"}`}
                />
              </button>
              {isOpen && (
                <div className="mt-1 space-y-1">
                  {visibleItems.map((item) => {
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
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default SideBar;
