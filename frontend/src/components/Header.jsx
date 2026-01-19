import React from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { IoSearch } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
// import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="flex justify-between items-center bg-gray-50 border-b-2 border-gray-200">
            <div className="flex w-full justify-between items-center pl-4">
                <button className="md:hidden text-2xl"><GiHamburgerMenu /></button>

                <div className="relative flex items-center">
                    <label htmlFor="search" className="sr-only">Search</label>
                    <input
                        id="search"
                        type="search"
                        placeholder="Search here..."
                        className="border border-gray-300 rounded-md pl-3 pr-10 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <button className="absolute right-2 text-gray-500"><IoSearch /></button>
                </div>

                <div className="flex items-center gap-4 cursor-pointer">
                    <p className="hidden sm:block">Hi Retesh</p>
                    <img
                        className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
                        src="https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg"
                        alt="User avatar"
                    />
                    <FaAngleDown />
                </div>
            </div>
        </header>
    )
}

export default Header