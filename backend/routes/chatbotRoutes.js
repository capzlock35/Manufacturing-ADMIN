import express from "express";
import { OpenAI } from "openai";
import AdminUser from "../model/adminModel.js";
import HRUser from "../model/hrModel.js";
import FinanceUser from "../model/financeModel.js";
import CoreUser from "../model/coreModel.js";
import LogisticUser from "../model/logisticModel.js";
import Announcement from "../model/announcementModel.js";
import VSannouncement from "../model/vsModel.js";
import * as XLSX from 'xlsx';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const accountCountDepartments = ["HR", "Finance", "Core", "Logistic", "Admin"];

const departmentModels = {
  Admin: AdminUser,
  HR: HRUser,
  Finance: FinanceUser,
  Core: CoreUser,
  Logistic: LogisticUser,
};

const announcementDepartments = ["Admin Announcement", "HR Announcement"];

const announcementModels = {
  "Admin Announcement": Announcement,
  "HR Announcement": VSannouncement,
};

const websitePoliciesText = ` Welcome to our admin management system. Your security is our priority, and we are committed to ensuring a safe and efficient platform for managing accounts and documents. By accessing this system, you agree to comply with the following terms:

• You must not share your login credentials with anyone.
• Unauthorized access attempts may result in account suspension.
• All actions related to account and document management are logged and monitored for security purposes.
• Admins are responsible for ensuring accuracy and compliance in account and document handling.
• By continuing, you acknowledge and agree to these terms within this AI-powered system.`;

const backupOptions = ["Accounts"];

router.post("/", async (req, res) => {
  const { option } = req.body;
  console.log("Received option:", option);

  if (option === "Hello! How can I help you?") {
    return res.json({
      message: "How can I help you?",
      options: [
        "How Many Accounts are Created",
        "What is the latest announcement?",
        "What are the website policies?",
        "Backups",
      ],
    });
  }

  if (option === "How Many Accounts are Created") {
    return res.json({
      message: "On What Department?",
      options: accountCountDepartments,
    });
  }

  if (option === "What is the latest announcement?") {
    return res.json({
      message: "In what department?",
      options: announcementDepartments,
    });
  }

  if (option === "What are the website policies?") {
    return res.json({
      message: websitePoliciesText,
    });
  }

  if (option === "Backups") {
    return res.json({
      message: "What do you want to backup?",
      options: backupOptions,
    });
  }

  if (option === "Accounts") {
    try {
      console.log("Starting 'Accounts' backup process...");
      const adminUsers = await AdminUser.find({});
      console.log("Admin Users fetched:", adminUsers.length);
      const financeUsers = await FinanceUser.find({});
      console.log("Finance Users fetched:", financeUsers.length);
      const hrUsers = await HRUser.find({});
      console.log("HR Users fetched:", hrUsers.length);
      const coreUsers = await CoreUser.find({});
      console.log("Core Users fetched:", coreUsers.length);
      const logisticUsers = await LogisticUser.find({});
      console.log("Logistic Users fetched:", logisticUsers.length);

      const usersToSheet = (users, sheetName, headers) => {
        const userDataForExcel = users.map(user => {
          const userData = {};
          headers.forEach(header => {
            userData[header] = user[header.toLowerCase()] || user[header] || '';
          });
          return userData;
        });
        const ws = XLSX.utils.json_to_sheet(userDataForExcel, { header: headers });
        XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });
        return ws;
      };

      const adminHeaders = ["userName", "email", "firstName", "lastName", "role", "birthday", "gender", "createdAt"];
      const financeHeaders = ["userName", "email", "email","fullName", "Role", "createdAt"];
      const hrHeaders = ["employeeId", "firstName", "lastName", "email", "role", "Hr", "position", "createdAt"]; // HR Headers - added EmployeeId and Position, kept Hr level
      const coreHeaders = ["name", "email", "Core", "role", "createdAt"]; // Core Headers - using "Name" and "Core" as in your schema
      const logisticHeaders = ["name", "email", "userName", "phone", "date", "address", "city", "age", "condition", "verified", "role", "createdAt"]; //

      const adminWs = usersToSheet(adminUsers, "Admin Accounts", adminHeaders);
      const financeWs = usersToSheet(financeUsers, "Finance Accounts", financeHeaders);
      const hrWs = usersToSheet(hrUsers, "HR Accounts", hrHeaders);
      const coreWs = usersToSheet(coreUsers, "Core Accounts", coreHeaders);
      const logisticWs = usersToSheet(logisticUsers, "Logistic Accounts", logisticHeaders);

      console.log("Worksheets created.");

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, adminWs, "Admin Accounts");
      XLSX.utils.book_append_sheet(wb, financeWs, "Finance Accounts");
      XLSX.utils.book_append_sheet(wb, hrWs, "HR Accounts");
      XLSX.utils.book_append_sheet(wb, coreWs, "Core Accounts");
      XLSX.utils.book_append_sheet(wb, logisticWs, "Logistic Accounts");

      console.log("Workbook created with sheets.");

      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
      console.log("Excel buffer generated. Buffer length:", excelBuffer.length);

      return res.json({
        message: "Downloading All Department Accounts...",
        backupFiles: {
          allAccounts: excelBuffer
        },
        fileType: 'xlsx',
        filenames: ['All_Department_Accounts.xlsx']
      });
      console.log("Response sent successfully.");

    } catch (error) {
      console.error("Error generating backup:", error);
      return res.status(500).json({ message: "Error generating backup files", error: error.message });
    }
  }


  if (accountCountDepartments.includes(option)) {
    const departmentModel = departmentModels[option];
    if (!departmentModel) {
      return res.json({ message: "Invalid department for account count." });
    }
    try {
      const count = await departmentModel.countDocuments();
      console.log(`Total Accounts in ${option}:`, count);
      return res.json({
        message: `The Total Account Created in ${option} Department is ${count}.`,
      });
    } catch (error) {
      console.error("Database error (account count):", error.message);
      return res.status(500).json({ message: "Error fetching account data", error: error.message });
    }
  }

  if (announcementDepartments.includes(option)) {
    const AnnouncementModel = announcementModels[option];
    if (!AnnouncementModel) {
      return res.json({ message: "Invalid department for announcements." });
    }
    try {
      const latestAnnouncement = await AnnouncementModel.findOne().sort({ date: -1 });
      if (!latestAnnouncement) {
        return res.json({ message: `No announcements available for ${option} at the moment.` });
      }
      return res.json({
        message: `Here is the latest announcement in ${option}:`,
        announcement: {
          date: latestAnnouncement.date.toISOString().split("T")[0],
          title: latestAnnouncement.title,
          content: latestAnnouncement.content || latestAnnouncement.description,
        },
      });
    } catch (error) {
      console.error("Database error (announcement):", error.message);
      return res.status(500).json({ message: "Error fetching announcement", error: error.message });
    }
  }

  console.log("Invalid option selected:", option);
  return res.json({ message: "Invalid Option." });
});

export default router;