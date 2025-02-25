// src/components/MessageBoard.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const MessageBoard = () => {
    const [messages, setMessages] = useState([]);
    const [newMessageText, setNewMessageText] = useState('');
    const [username, setUsername] = useState('');
    const [loadingUsername, setLoadingUsername] = useState(true);
    const ws = useRef(null);

    // **Define base URL based on environment**
    const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api'
        : 'http://localhost:7690/api';

    // **Admin Users Base URL (for fetching username)**
    const adminUsersBaseURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/adminusers'
        : 'http://localhost:7690/api/adminusers';

    // **Define WebSocket URL similarly**
    const wsURL = process.env.NODE_ENV === 'production'
    ? 'wss://backend-admin.jjm-manufacturing.com' // **Correct: wss:// for production**
    : 'ws://localhost:7690';
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`${baseURL}/messages`);
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        const fetchUsername = async () => {
            const userid = localStorage.getItem('userid');
            const token = localStorage.getItem('token');

            if (!userid || !token) {
                console.error("userid or token not found in local storage.");
                setUsername("Unknown User - No UserID or Token");
                setLoadingUsername(false);
                return;
            }

            try {
                const response = await axios.get(`${adminUsersBaseURL}/username/${userid}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("MessageBoard.jsx - fetchUsername - response.data:", response.data);
                if (response.data && response.data.username) {
                    setUsername(response.data.username);
                } else {
                    setUsername("Unknown User - No userName in Response");
                }
            } catch (error) {
                console.error('Error fetching userName:', error);
                setUsername('Unknown User - Fetch Error');
            } finally {
                setLoadingUsername(false);
            }
        };

        fetchMessages();
        fetchUsername();

        ws.current = new WebSocket(wsURL);

        ws.current.onopen = () => {
            console.log("WebSocket connection opened");
        };

        ws.current.onmessage = event => {
            console.log("WebSocket onmessage event triggered");
            console.log("WebSocket message data received:", event.data);

            try {
                const message = JSON.parse(event.data);
                console.log("Parsed message from WebSocket:", message);
                setMessages(prevMessages => {
                    console.log("Previous messages state:", prevMessages);
                    const updatedMessages = [...prevMessages, message];
                    console.log("Updated messages state:", updatedMessages);
                    return updatedMessages;
                });
                console.log("Messages state updated successfully");
            } catch (error) {
                console.error("Error parsing WebSocket message data:", error);
            }
        };

        ws.current.onclose = () => {
            console.log("WebSocket connection closed");
        };

        ws.current.onerror = error => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.close();
            }
        };
    }, []);

    const handleSendMessage = () => {
        if (newMessageText.trim() && username) {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) { // **Check connection state**
                const messagePayload = { username, message: newMessageText };
                ws.current.send(JSON.stringify(messagePayload));
                setNewMessageText('');
            } else {
                console.error("WebSocket connection is not open. Cannot send message.");
                alert("Could not send message. WebSocket connection is not open."); // Inform user
            }
        } else if (!username && !loadingUsername) {
            alert("Username could not be determined. Please refresh the page or contact support.");
        }
    };

    return (
        <div className="min-h-screen bg-white py-6"> {/* Main background is white */}
            <div className="container mx-auto p-4 flex flex-col h-full"> {/* Main container flex column */}

                {/* **Container 1: Title + Username Area - Light Yellow Background** */}
                <div className="mb-4 p-2 bg-yellow-50 border-b border-gray-200"> {/* Added bg-yellow-50 */}
                    <h2 className="text-2xl font-bold mb-2 text-black">Message Board</h2>
                    {loadingUsername ? (
                        <p>Loading username...</p>
                    ) : (
                        <div>
                            <p className="block text-gray-700 text-sm font-bold mb-0">Logged in as: <span className="font-normal">{username || 'Guest'}</span></p>
                        </div>
                    )}
                </div>

                {/* **Container 2: Chatbox (Message Display Area) - Light Gray Background** */}
                <div className="flex flex-col mb-4 border rounded p-2 h-96 overflow-y-auto flex-grow text-black border-black bg-gray-200"> {/* Added bg-gray-50 */}
                    {messages.map(msg => {
                        const isCurrentUserMessage = msg.username === username;
                        return (
                            <div
                                key={msg._id}
                                className={`mb-2 p-2 rounded bg-gray-100 ${isCurrentUserMessage ? 'self-end bg-blue-100 text-right' : 'self-start bg-gray-100 text-left'}`}
                            >
                                <p className="font-bold">{msg.username} <span className="text-sm font-normal text-gray-500">{new Date(msg.timestamp).toLocaleString()}</span></p>
                                <p>{msg.message}</p>
                            </div>
                        );
                    })}
                    {messages.length === 0 && <p className="text-gray-500 text-center">No messages yet. Be the first to post!</p>}
                </div>

                {/* **Container 3: Send Message Area - Light Green Background** */}
                <div className="flex p-2 bg-green-50 border-t border-gray-200"> {/* Added bg-green-50 */}
                    <input
                        type="text"
                        placeholder="Enter your message..."
                        className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-black border-black leading-tight focus:outline-none focus:shadow-outline mr-2"
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' ? handleSendMessage() : null}
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                </div>

            </div>
        </div>
    );
};

export default MessageBoard;