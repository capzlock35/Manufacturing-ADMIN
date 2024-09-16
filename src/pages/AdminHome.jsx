import React from 'react'
import Sidebar from '../components/Sidebar'
import Search from '../components/Search'
import Dashboard from '../components/Dashboard'

const AdminHome = () => {
  return (
    <div className="flex">
    <Sidebar />
    <div className="flex-col w-full">
      <Search />
      <Dashboard />
    </div>
  </div>
  )
}

export default AdminHome