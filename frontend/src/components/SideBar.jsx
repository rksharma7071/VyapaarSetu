import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FaAngleDown, FaRegUser } from "react-icons/fa6";
import { BsBox } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { TbUsersGroup } from "react-icons/tb";
import { HiViewGridAdd } from "react-icons/hi";
import { AiOutlineStock, AiOutlinePercentage, AiOutlineFile } from "react-icons/ai";
import { BiCategory, BiSubdirectoryRight } from "react-icons/bi";
import { FiShoppingCart } from "react-icons/fi";
import { PiCaretDoubleLeftBold } from "react-icons/pi";

function SideBar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [menu, setMenu] = useState(() => {
    const stored = localStorage.getItem("menu");
    return stored !== null ? JSON.parse(stored) : true;
  });
  const location = useLocation();

  const handleOpenMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const handleMenu = () => {
    setMenu(prev => !prev);
  };

  const menuItems = [
    { label: "Dashboard", to: "/", icon: RxDashboard },
    { label: "Product", to: "/products", icon: BsBox },
    {
      label: "Product",
      key: "products",
      icon: BsBox,
      subMenu: [
        { label: "Create Product", to: "/create-products", icon: HiViewGridAdd },
        { label: "Expired Products", to: "/expired-products", icon: BsBox },
        { label: "Low Stocks", to: "/low-stocks", icon: AiOutlineStock },
        { label: "Category", to: "/category", icon: BiCategory },
        { label: "Sub Category", to: "/sub-category", icon: BiSubdirectoryRight },
        { label: "Brands", to: "/brands", icon: BsBox },
        { label: "Manage Stock", to: "/manage-stock", icon: AiOutlineStock },
      ],
    },

    { label: "Sales", to: "/sales", icon: FiShoppingCart },
    { label: "Invoices", to: "/invoices", icon: AiOutlineFile },
    { label: "Discount", to: "/discount", icon: AiOutlinePercentage },
    { label: "Customer", to: "/customers", icon: TbUsersGroup },
    { label: "Employee", to: "/employee", icon: FaRegUser },
    { label: "Reports", to: "/reports", icon: AiOutlineFile },
    { label: "Settings", to: "/settings", icon: IoSettingsOutline },
  ];

  useEffect(() => {
    localStorage.setItem("menu", JSON.stringify(menu));
  }, [menu]);

  return (
    <div className={`${menu === true ? "w-56" : ""} border-r border-gray-200 relative`}>
      <Link to="/" className="w-[inherit] block h-20 border-b border-gray-200 px-4 py-2">
        {menu === true ?
          <img src="logo.png" alt="Company Logo" loading="lazy" className="h-14" />
          :
          <img src="favicon.png" alt="Company Logo" loading="lazy" className="h-14" />
        }
      </Link>
      <div
        className={`fixed top-7 ${menu === true ? "left-52" : "left-21"} bg-primary rounded-full p-1 text-white font-bold cursor-pointer z-10`}
        onClick={handleMenu}>
        <PiCaretDoubleLeftBold />
      </div>

      <div className="p-2">
        {/* <p className="text-sm pb-2 text-gray-600">Main</p> */}

        {menuItems.map((item) => {
          const subMenuActive = item.subMenu?.some(sub => sub.to === location.pathname);

          return (
            <div key={item.label}>
              <NavLink
                to={item.to || "#"}
                end={!!item.to}
                onClick={() => item.subMenu && handleOpenMenu(item.key)}
                className={() =>
                  `flex items-center justify-between gap-5 p-2 rounded-lg mb-2
                  ${subMenuActive || location.pathname === item.to ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                }
              >
                <div className={`flex items-center ${menu === true ? "justify-between" : "justify-center"} w-full`}>
                  <div className="flex items-center gap-5 text-sm">
                    <item.icon />
                    {menu === true && item.label}
                  </div>

                  {item.subMenu && menu && (
                    <FaAngleDown
                      className={`text-xl p-1 rounded-full transition-transform
                        ${openMenu === item.key || subMenuActive ? "rotate-180 bg-primary/20 text-primary" : "bg-gray-100 text-gray-600"}`}
                    />
                  )}
                </div>
              </NavLink>

              {item.subMenu && (openMenu === item.key || subMenuActive) && (
                <div className="ml-4 border-l-4 border-primary pl-2">
                  {item.subMenu.map((sub) => (
                    <NavLink
                      key={sub.label}
                      to={sub.to}
                      className={({ isActive }) =>
                        `flex items-center gap-5 p-2 rounded-lg mb-2
                        ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                      }
                    >
                      <div className="flex items-center w-full gap-5 text-sm">
                        <sub.icon />
                        {menu === true ? sub.label : ""}
                      </div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SideBar;
