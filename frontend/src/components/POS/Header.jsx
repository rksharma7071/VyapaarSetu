import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { GoScreenFull } from "react-icons/go";
import { RiResetRightFill } from "react-icons/ri";
import { TiShoppingCart } from "react-icons/ti";
import { useState } from "react";
import { FaLaptop } from "react-icons/fa";

function Header() {
    const [open, setOpen] = useState(false);

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

                    <img
                        src="https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg"
                        alt="User avatar"
                        className="ml-2 h-10 w-10 rounded-lg border border-gray-200 object-cover"
                    />
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

                    <div className="mt-4 flex justify-end">
                        <img
                            src="https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg"
                            alt="User avatar"
                            className="h-10 w-10 rounded-lg border border-gray-200 object-cover"
                        />
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;
