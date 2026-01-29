import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import SideBar from './components/SideBar'
import { Outlet } from 'react-router-dom'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {

  return (
    <div className='flex min-h-screen'>
      <SideBar />
      <div className='flex-1'>
        <Header />
        <Outlet />
      </div>
    </div>
  )
}

export default App
