import React from 'react'
import Sidebar from '../components/Sidebar'
import Search from '../components/Search'
import Dashboard from '../components/Dashboard'
import { Route, Routes } from 'react-router-dom'
import DocumentStorage from '../components/DocumentStorage'


const AdminHome = () => {
  return (

      <div className="flex h-screen overflow-auto">
      <Sidebar  />
      <div className="flex-col w-full">
        <Search />
        <Routes>
          <Route path='/' element={<Dashboard/>} />
          <Route path='DocumentStorage' element={<DocumentStorage/>} />

        </Routes>
      </div>
    </div>

  )
}

export default AdminHome