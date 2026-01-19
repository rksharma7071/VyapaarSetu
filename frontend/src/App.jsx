import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import Counter from './components/counter'
import SideBar from './components/SideBar'

function App() {

  return (
    <div className='flex min-h-screen'>
      <SideBar />
      <div className='flex-1'>
        <Header />
      </div>
    </div>
  )
}

export default App
