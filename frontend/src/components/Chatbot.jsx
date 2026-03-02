import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://backend-admin.jjm-manufacturing.com/api/"
    : "http://localhost:7690/api/";

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you?" },
  ]);
  const [options, setOptions] = useState([
    "How Many Accounts are Created",
    "What is the latest announcement?",
    "What are the website policies?",
    "Backups", // Backups option
  ]);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleOptionClick = async (option) => {
    setMessages((prev) => [...prev, { sender: "user", text: option }]);

    if (option === "Thank you very much") {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "You're welcome!" },
        { sender: "bot", text: "Any questions?" },
      ]);
      setOptions([
        "How Many Accounts are Created",
        "What is the latest announcement?",
        "What are the website policies?",
        "Backups",
      ]);
      return;
    }

    try {
      const response = await axios.post(`${baseURL}chatbot`, { option });

      if (option === "What is the latest announcement?" || ["Admin Announcement", "HR Announcement"].includes(option)) {
        if (response.data.announcement) {
          const { title, content, date } = response.data.announcement;
          const formattedMessage = `📅 ${date}\n**${title}**\n${content || ""}`;
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: response.data.message || "Here is the latest announcement:" },
            { sender: "bot", text: formattedMessage },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: response.data.message || "No announcements available at the moment." },
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: response.data.message },
        ]);
      }

      // ✅ Step 7 & 8: Handling "Backups" -> "Accounts" Response (MODIFIED for single file) ✅
      if (option === "Accounts") {
        if (response.data.backupFiles) {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: response.data.message }, // "Downloading All Department Accounts..."
          ]);

          // Function to trigger download from base64 data (REMAINS THE SAME)
          const downloadExcel = (base64Data, filename) => {
            const byteCharacters = atob(base64Data);
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
              const slice = byteCharacters.slice(offset, offset + 512);
              const byteNumbers = new Array(slice.length);
              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
            const blob = new Blob(byteArrays, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          };

          // Trigger download for the SINGLE combined file
          if (response.data.backupFiles.allAccounts && response.data.filenames[0]) { // Use index 0 for single filename
            downloadExcel(response.data.backupFiles.allAccounts, response.data.filenames[0]);
          }

        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: response.data.message || "Error fetching backup data." },
          ]);
        }
      }

      if (response.data.options) {
        setOptions(response.data.options);
      } else {
        setOptions(["Thank you very much"]);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Oops! I couldn't fetch the answer. Please try again later.",
        },
      ]);
      setOptions(["Thank you very much"]);
    }
  };

  return (
    <div className="chatbot-container fixed bottom-0 right-0 m-4 border border-gray-300 rounded-md shadow-lg bg-white w-96 h-[80vh] flex flex-col z-50">
      <div className="chat-header p-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Chatbot</h3>
        <button
          onClick={onClose}
          className="focus:outline-none"
          aria-label="Close Chatbot"
        >
          <IoClose className="text-2xl text-gray-600 hover:text-gray-800" />
        </button>
      </div>
      <div ref={chatWindowRef} className="chat-messages p-4 overflow-y-auto flex-1">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-md max-w-[75%] ${
              message.sender === "bot"
                ? "bg-blue-500 text-white self-start"
                : "bg-green-500 text-white self-end ml-auto"
            }`}
          >
            <span className="font-semibold">{message.sender}:</span>
            {message.text && message.text.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ))}
      </div>
      <div className="options p-4 border-t border-gray-200">
        {options.length > 0 &&
          options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 mb-2 w-full"
            >
              {option}
            </button>
          ))}
      </div>
    </div>
  );
};

export default Chatbot;