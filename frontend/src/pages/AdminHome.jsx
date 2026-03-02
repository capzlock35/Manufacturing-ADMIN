import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import StaffSide from '../components/StaffSide';
import SuperSide from '../components/SuperSide';
import Search from '../components/Search';
import Dashboard from '../components/Dashboard';
import { Route, Routes } from 'react-router-dom';
import DocumentStorage from '../components/DocumentStorage';
import AdminList from '../components/AdminList';
import VersionControl from '../components/VersionControl';
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
import Footer from '../components/Footer';
import AccountList from '../components/AccountList';
import RequestResources from '../components/RequestResources';
import HrCreate from '../components/HrCreate';
import CoreCreate from '../components/CoreCreate';
import LogisticCreate from '../components/LogisticCreate';
import FinanceCreate from '../components/FinanceCreate';
import AdminCreate from '../components/AdminCreate';
import NewEmployee from '../components/NewEmployee';
import Product from '../components/Product';
import Announcement from '../components/Announcement';
import DocumentHr3 from '../components/DocumentHr3';
import QualityControl from '../components/QualityControl';
import MessageBoard from '../components/MessageBoard';
import FinancialReport from '../components/FinancialReport';
import SuperDashboard from '../components/SuperDashboard';
import Chatbot from '../components/Chatbot'; // Import Chatbot from Chatbot.jsx
import { RiRobot2Fill } from "react-icons/ri";
import AuditReport from '../components/AuditReport';
import RequestAudit from '../components/RequestAudit';
import Logs from '../components/Logs'
import InactiveRiskAssessments from '../components/InactiveRiskAssessments';
import InactiveCoreList from '../components/InactiveCoreList';
import InactiveAdminList from '../components/InactiveAdminList';

const AdminHome = () => {
    const [role, setRole] = useState('');
    const [isChatbotVisible, setIsChatbotVisible] = useState(false);

    const toggleChatbotVisibility = () => {
        setIsChatbotVisible(!isChatbotVisible);
    };

    const hideChatbot = () => {
        setIsChatbotVisible(false);
    };

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole);
    }, []);

    return (
        <div className="flex h-screen overflow-auto">
            {/* Conditionally render Sidebar or StaffSide based on role */}
            {role === 'admin' ? <Sidebar /> : role === 'staff' ? <StaffSide /> : role === 'superadmin' ? <SuperSide/> : null}

            <div className="flex-col w-full relative">
                <Search />
                <Routes>
                    {role === 'superadmin' ? (
                        <Route path="/" element={<SuperDashboard />} />
                    ) : (
                        <Route path="/" element={<Dashboard />} />
                    )}
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
                    <Route path="ContractManagement" element={<ContractManagement />} />
                    <Route path="RiskManagement" element={<RiskManagement />} />
                    <Route path="WorkflowIdentification" element={<WorkflowIdentification />} />
                    <Route path="CommunicationPlan" element={<CommunicationPlan />} />
                    <Route path="ResourcesAllocation" element={<ResourcesAllocation />} />
                    <Route path="profile" element={<ProfileUser />} />
                    <Route path="register" element={<Register />} />
                    <Route path="accountlist" element={<AccountList />} />
                    <Route path="requestresources" element={<RequestResources />} />
                    <Route path="HrCreate" element={<HrCreate />} />
                    <Route path="CoreCreate" element={<CoreCreate />} />
                    <Route path="LogisticCreate" element={<LogisticCreate />} />
                    <Route path="FinanceCreate" element={<FinanceCreate />} />
                    <Route path="AdminCreate" element={<AdminCreate />} />
                    {/* <Route path="Product" element={<Product />} /> */}
                    <Route path="NewEmployee" element={<NewEmployee />} />
                    <Route path="Announcement" element={<Announcement />} />
                    <Route path="DocumentHr3" element={<DocumentHr3 />} />
                    <Route path="QualityControl" element={<QualityControl />} />
                    {/* <Route path="MessageBoard" element={<MessageBoard />} /> */}
                    <Route path="FinancialReport" element={<FinancialReport />} />
                    <Route path="AuditReport" element={<AuditReport />} />
                    <Route path="RequestAudit" element={<RequestAudit />} />
                    <Route path="Logs" element={<Logs />} />
                    <Route path="InactiveRiskAssessments" element={<InactiveRiskAssessments />} />
                    <Route path="InactiveCoreList" element={<InactiveCoreList />} />
                    <Route path="InactiveAdminList" element={<InactiveAdminList />} />


                </Routes>
                <div className="">
                    <Footer />
                </div>

                {/* Robot Icon and Conditional Chatbot Rendering - Only for superadmin */}
                {(role === 'superadmin' || role === 'admin') && (
                    <>
                        {/* Robot Icon - Only show if chatbot is NOT visible */}
                        {/* {!isChatbotVisible && (
                            <div className="fixed bottom-5 right-5 z-50">
                                <div
                                    className="bg-white rounded-full p-3 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                    onClick={toggleChatbotVisibility}
                                >
                                    <RiRobot2Fill className="text-4xl text-gray-800 hover:text-gray-900" />
                                </div>
                            </div>
                        )} */}
                        {/* Chatbot - Only show if chatbot IS visible */}
                        {/* {isChatbotVisible && <Chatbot onClose={hideChatbot} />} */}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminHome;