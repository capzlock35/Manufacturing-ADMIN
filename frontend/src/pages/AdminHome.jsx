import React from 'react'
import Sidebar from '../components/Sidebar'
import Search from '../components/Search'
import Dashboard from '../components/Dashboard'
import { Route, Routes } from 'react-router-dom'
import DocumentStorage from '../components/DocumentStorage'
import AdminList from '../components/AdminList'
import VersionControl from '../components/VersionControl'
import DocumentTracking from '../components/DocumentTracking'
import HrList from '../components/HrList'
import CoreList from '../components/CoreList'
import LogisticList from '../components/LogisticList'
import FinanceList from '../components/FinanceList'


const AdminHome = () => {
  return (

      <div className="flex h-screen overflow-auto">
      <Sidebar  />
      <div className="flex-col w-full">
        <Search />
        <Routes>
          <Route path='/' element={<Dashboard/>} />
          <Route path='AdminList' element={<AdminList />}/>
          <Route path='HrList' element={<HrList />}/>
          <Route path='CoreList' element={<CoreList />}/>
          <Route path='LogisticList' element={<LogisticList />}/>
          <Route path='FinanceList' element={<FinanceList />}/>
          <Route path='DocumentStorage' element={<DocumentStorage/>} />
          <Route path='VersionControl' element={<VersionControl/>} />
          <Route path='DocumentTracking' element={<DocumentTracking/>} />
        </Routes>
      </div>
    </div>

  )
}

export default AdminHome