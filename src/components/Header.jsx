import React from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { IoSearch } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import { useMyContext } from '../assets/context/MyContext';


function Header() {
    const {name} = useMyContext();
  return (
    <header>
        <div className='hamburger'><GiHamburgerMenu/></div>
        <div className='search'>
            <IoSearch htmlFor="search"/>
            <input id='search' type="search" placeholder='Search here...' />
            <button>Search</button>
        </div>
        <div className='profile'>
            <p>Hi {name}</p>
            <img src="https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80" alt="" />
            <FaAngleDown />
            
        </div>
    </header>
  )
}

export default Header