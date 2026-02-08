import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { GoScreenFull } from "react-icons/go";
import { RiResetRightFill } from "react-icons/ri";
import { TiShoppingCart } from "react-icons/ti";
import { useMemo, useState } from "react";
import { FaLaptop } from "react-icons/fa";

function Header() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const user = useMemo(
        () => JSON.parse(localStorage.getItem("user") || "null"),
        [],
    );
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("pos_store_id");
        if (window?.axios?.defaults?.headers?.common?.Authorization) {
            delete window.axios.defaults.headers.common.Authorization;
        }
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="flex h-20 items-center justify-between px-4">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setOpen(!open)}
                        className="text-2xl md:hidden"
                    >
                        <GiHamburgerMenu />
                    </button>

                    <Link to="/" className="flex items-center">
                        <img
                            src="logo.png"
                            alt="Company Logo"
                            className="h-12 object-contain"
                        />
                    </Link>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-2">
                    <Link to={'/pos'} className='flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90'>
                        <FaLaptop />
                        POS
                    </Link>
                    <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90">
                        <TiShoppingCart className="text-lg" />
                        Orders
                    </button>

                    <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <RiResetRightFill className="text-lg" />
                        Reset
                    </button>

                    <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <GoScreenFull className="text-lg" />
                        Full Screen
                    </button>

                    <div className="mx-2 h-6 w-px bg-gray-300" />

                    <Link
                        to="/"
                        className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary/90"
                    >
                        <TbLayoutDashboardFilled className="text-lg" />
                        Dashboard
                    </Link>

                    <div className="relative ml-2">
                        <button
                            onClick={() => setUserMenuOpen((v) => !v)}
                            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-1.5"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
                                {user?.name?.[0] || "U"}
                            </div>
                            <div className="leading-tight text-left">
                                <div className="text-sm font-semibold text-gray-900">
                                    {user?.name || "User"}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {user?.email || ""}
                                </div>
                            </div>
                        </button>
                        {userMenuOpen && (
                            <div className="absolute right-0 top-12 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                                <Link
                                    to="/pos"
                                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    POS
                                </Link>
                                <Link
                                    to="/orders"
                                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    Orders
                                </Link>
                                <Link
                                    to="/"
                                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {open && (
                <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3">
                    <div className="grid grid-cols-2 gap-3">

                        <button className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-white">
                            <TiShoppingCart />
                            Orders
                        </button>

                        <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-sm">
                            <RiResetRightFill />
                            Reset
                        </button>

                        <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-sm">
                            <GoScreenFull />
                            Full Screen
                        </button>

                        <Link
                            to="/"
                            className="flex items-center justify-center gap-2 rounded-lg bg-secondary py-2 text-sm font-semibold text-white"
                        >
                            <TbLayoutDashboardFilled />
                            Dashboard
                        </Link>
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
                                {user?.name?.[0] || "U"}
                            </div>
                            <div className="leading-tight">
                                <div className="text-sm font-semibold text-gray-900">
                                    {user?.name || "User"}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {user?.email || ""}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                to="/"
                                className="rounded-lg border border-gray-300 px-3 py-1 text-xs"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="rounded-lg border border-gray-300 px-3 py-1 text-xs"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;
