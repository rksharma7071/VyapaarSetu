import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoSearch } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import { FaLaptop, FaRegUser } from "react-icons/fa";
import { TbReload, TbX } from "react-icons/tb";
import { RxDashboard } from "react-icons/rx";
import { BsBox } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineFile, AiOutlinePercentage } from "react-icons/ai";
import { TbUsersGroup } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { handleRefresh } from "../data/refresh";

function Header() {
    const [open, setOpen] = useState(false);

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
        <>
            {/* HEADER */}
            <header className="relative z-50 flex h-20 items-center justify-between border-b border-gray-300 bg-white px-4">
                <button className="text-2xl md:hidden" onClick={() => setOpen(true)} ><GiHamburgerMenu /></button>

                {/* Desktop Search */}
                <div className="relative ml-4 hidden w-full max-w-sm md:flex">
                    <IoSearch className="absolute left-3 top-3 text-gray-500" />
                    <input placeholder="Search..." className="w-full rounded-lg border border-gray-300 py-2 pl-10 text-sm" />
                </div>

                {/* Desktop actions */}
                <div className="ml-auto items-center gap-3 flex">
                    <button onClick={handleRefresh} className="hidden sm:flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white"><TbReload />Refresh</button>
                    <Link to="/pos" className="hidden sm:flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white"><FaLaptop />POS</Link>
                    <img
                        src="https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg"
                        className="h-10 w-10 rounded-lg border border-gray-300 object-cover"
                    />
                </div>
            
            </header>

            {/* OVERLAY */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* MOBILE DRAWER */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-full bg-white transition-transform duration-300 md:hidden
        ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-300 p-4">
                    <h3 className="text-lg font-semibold">Menu</h3>
                    <button onClick={() => setOpen(false)}>
                        <TbX className="text-xl" />
                    </button>

                </div>

                {/* CONTENT */}
                <div className="grid h-[calc(100vh-4rem)] grid-cols-1">

                    {/* LEFT: MENU */}
                    <nav className="col-span-2 overflow-y-auto border-r border-gray-300 p-4 space-y-1">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                  ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                            >
                                <item.icon className="text-lg" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* RIGHT: USER PANEL */}
                    {/* <div className="col-span-1 flex flex-col justify-between p-4">
            <div className="flex flex-col items-center text-center">
              <img
                src="https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg"
                className="h-16 w-16 rounded-full border object-cover"
              />
              <p className="mt-2 text-sm font-semibold">Admin User</p>
              <p className="text-xs text-gray-500">admin@site.com</p>
            </div>

            <div className="space-y-2">
              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="block rounded-lg border px-3 py-2 text-center text-sm"
              >
                Settings
              </Link>

              <button className="w-full rounded-lg bg-red-500 px-3 py-2 text-sm text-white">
                Logout
              </button>
            </div>
          </div> */}
                </div>
            </div>
        </>
    );
}

export default Header;
