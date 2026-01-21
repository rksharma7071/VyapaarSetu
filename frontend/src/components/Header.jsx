import { GiHamburgerMenu } from "react-icons/gi";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FaLaptop } from "react-icons/fa";

function Header() {
    return (
        <header className="flex justify-between items-center bg-white border-b border-gray-200 h-20">
            <div className="flex w-full justify-between items-center p-4">
                <button className="md:hidden text-2xl"><GiHamburgerMenu /></button>

                <div className="relative flex items-center w-full max-w-sm">
                    <label htmlFor="search" className="sr-only">Search</label>
                    <span className="absolute left-3 text-gray-500"><IoSearch className="text-lg" /></span>

                    <input id="search" type="text" placeholder="Search here..."
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-20 text-sm text-gray-700 placeholder-gray-400 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                    <span className="absolute right-3 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">Ctrl + K</span>
                </div>

                <div className="flex items-center gap-3 cursor-pointer">
                    <Link to={'/'} className='flex gap-2 justify-center items-center bg-secondary px-2 py-1 rounded-lg text-light text-sm font-semibold'>
                        <FaLaptop />
                        POS
                    </Link>
                    <img
                        className="w-12 h-12 rounded-lg border-2 border-gray-200 object-cover"
                        src="https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg"
                        alt="User avatar"
                    />
                </div>
            </div>
        </header>
    )
}

export default Header