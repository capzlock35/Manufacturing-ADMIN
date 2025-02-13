import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import StaffSide from '../components/StaffSide';
import Search from '../components/Search';
import Dashboard from '../components/Dashboard';
import { Route, Routes } from 'react-router-dom';
import DocumentStorage from '../components/DocumentStorage';
import AdminList from '../components/AdminList';
import VersionControl from '../components/VersionControl';
import DocumentTracking from '../components/DocumentTracking';
import HrList from '../components/HrList';
import CoreList from '../components/CoreList';
import LogisticList from '../components/LogisticList';
import FinanceList from '../components/FinanceList';
import HrList1 from '../components/HrList1';
import HrList2 from '../components/HrList2';
import HrList3 from '../components/HrList3';
import HrList4 from '../components/HrList4';
import CoreList1 from '../components/CoreList1';
import CoreList2 from '../components/CoreList2';
import LogisticList1 from '../components/LogisticList1';
import LogisticList2 from '../components/LogisticList2';
import ContractManagement from '../components/ContractManagement';
import LegalDocument from '../components/LegalDocument';
import RiskManagement from '../components/RiskManagement';
import LitigationManagement from '../components/LitigationManagement';
import CompliancesandRegulatory from '../components/CompliancesandRegulatory';
import WorkflowIdentification from '../components/WorkflowIdentification';
import CommunicationPlan from '../components/CommunicationPlan';
import ResourcesAllocation from '../components/ResourcesAllocation';
import ProfileUser from '../components/ProfileUser';
import Register from './Register';
import Footer from '../components/Footer'; // Import the Footer component
import Settings from '../components/Settings';
import AccountList from '../components/AccountList';
import RequestResources from '../components/RequestResources';
import HrCreate from '../components/HrCreate';
import CoreCreate from '../components/CoreCreate';
import LogisticCreate from '../components/LogisticCreate';
import FinanceCreate from '../components/FinanceCreate';
import AdminCreate from '../components/AdminCreate';

const AdminHome = () => {
  const [role, setRole] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
  }, []);

  

  return (
    <div className="flex h-screen overflow-auto">
      {/* Conditionally render Sidebar or StaffSide based on role */}
      {role === 'admin' ? <Sidebar /> : role === 'staff' ? <StaffSide /> : null}

      <div className="flex-col w-full">
        <Search />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="AdminList" element={<AdminList />} />
          <Route path="HrList1" element={<HrList1 />} />
          <Route path="HrList2" element={<HrList2 />} />
          <Route path="HrList3" element={<HrList3 />} />
          <Route path="HrList4" element={<HrList4 />} />
          <Route path="CoreList1" element={<CoreList1 />} />
          <Route path="CoreList2" element={<CoreList2 />} />
          <Route path="LogisticList1" element={<LogisticList1 />} />
          <Route path="LogisticList2" element={<LogisticList2 />} />
          <Route path="FinanceList" element={<FinanceList />} />
          <Route path="DocumentStorage" element={<DocumentStorage />} />
          <Route path="VersionControl" element={<VersionControl />} />
          <Route path="DocumentTracking" element={<DocumentTracking />} />
          <Route path="ContractManagement" element={<ContractManagement />} />
          <Route path="LegalDocument" element={<LegalDocument />} />
          <Route path="RiskManagement" element={<RiskManagement />} />
          <Route path="LitigationManagement" element={<LitigationManagement />} />
          <Route path="CompliancesandRegulatory" element={<CompliancesandRegulatory />} />
          <Route path="WorkflowIdentification" element={<WorkflowIdentification />} />
          <Route path="CommunicationPlan" element={<CommunicationPlan />} />
          <Route path="ResourcesAllocation" element={<ResourcesAllocation />} />
          <Route path="profile" element={<ProfileUser />} />
          <Route path="settings" element={<Settings />} />
          <Route path="register" element={<Register />} />
          <Route path="accountlist" element={<AccountList />} />
          <Route path="requestresources" element={<RequestResources />} />
          <Route path="HrCreate" element={<HrCreate />} />
          <Route path="CoreCreate" element={<CoreCreate />} />
          <Route path="LogisticCreate" element={<LogisticCreate />} />
          <Route path="FinanceCreate" element={<FinanceCreate />} />
          <Route path="AdminCreate" element={<AdminCreate />} />
        </Routes>
        <div className="">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
