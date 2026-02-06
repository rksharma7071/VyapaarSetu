import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import SideBar from './components/SideBar'
import { Outlet } from 'react-router-dom'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {

  return (
    <div className='flex h-screen overflow-hidden'>
      <SideBar />
      {/* MAIN AREA */}
      <div className='flex flex-1 flex-col w-full'>
        <Header />
        {/* SCROLLABLE MAIN CONTENT */}
        <Outlet />
      </div>
    </div>
  )
}

export default App
