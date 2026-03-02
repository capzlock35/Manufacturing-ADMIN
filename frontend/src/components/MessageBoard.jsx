import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import TimeAgo from 'react-timeago';

const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api'
    : 'http://localhost:7690/api';

const adminUsersBaseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/adminusers'
    : 'http://localhost:7690/api/adminusers';

const CommunicationPlan = () => {
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState(''); // Initialize username as empty string
    const [loadingUsername, setLoadingUsername] = useState(true); // Add loadingUsername state
    const [newChannelName, setNewChannelName] = useState('');
    const [isAddingChannel, setIsAddingChannel] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchChannels();
        fetchUsername(); // Fetch username on component mount
    }, []);

    useEffect(() => {
        if (selectedChannel) {
            fetchMessages(selectedChannel._id);
        } else {
            setMessages([]);
        }
    }, [selectedChannel]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchChannels = async () => {
        try {
            const response = await axios.get(`${baseURL}/channels`);
            setChannels(response.data);
        } catch (error) {
            console.error("Error fetching channels:", error);
        }
    };

    const fetchMessages = async (channelId) => {
        try {
            const response = await axios.get(`${baseURL}/messages/channel/${channelId}`);
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
            console.log("CommunicationPlan.jsx - fetchUsername - response.data:", response.data);
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


    const handleChannelSelect = (channel) => {
        setSelectedChannel(channel);
    };

    const handleSendMessage = async (messageContent) => {
        if (!selectedChannel) return;

        if (!username && !loadingUsername) {
            alert("Username could not be determined. Please refresh the page or contact support.");
            return; // Exit if username is not available
        }

        try {
            const response = await axios.post(`${baseURL}/messages`, {
                channelId: selectedChannel._id,
                username: username, // Use fetched username here
                content: messageContent,
            });
            if (response.status === 201) {
                fetchMessages(selectedChannel._id);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleAddChannel = async (channelName) => {
        try {
            const response = await axios.post(`${baseURL}/channels`, { name: channelName });
            if (response.status === 201) {
                fetchChannels();
            }
        } catch (error) {
            console.error("Error adding channel:", error);
        }
    };

    // Channel List Handlers
    const handleAddChannelClick = () => {
        setIsAddingChannel(true);
    };

    const handleCreateChannel = () => {
        if (newChannelName.trim()) {
            handleAddChannel(newChannelName);
            setNewChannelName('');
            setIsAddingChannel(false);
        }
    };

    const handleCancelAddChannel = () => {
        setIsAddingChannel(false);
        setNewChannelName('');
    };

    // Message Section Handlers
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleInputChange = (e) => {
        setMessageInput(e.target.value);
    };

    const handleSendMessageClick = () => {
        if (messageInput.trim()) {
            handleSendMessage(messageInput);
            setMessageInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessageClick();
        }
    };

    const Message = ({ message }) => {
        return (
            <div className="mb-2 p-3 bg-gray-100 rounded-lg shadow-sm">
                <div className="font-semibold">{message.username}</div>
                <div className="text-gray-700">{message.content}</div>
                <div className="text-sm text-gray-500 mt-1">
                    <TimeAgo date={message.timestamp} />
                </div>
            </div>
        );
    };


    const ChannelListComponent = () => (
        <div>
            <h2 className="text-xl font-semibold mb-4">Channels</h2>
            <ul>
                {channels.map(channel => (
                    <li
                        key={channel._id}
                        onClick={() => handleChannelSelect(channel)}
                        className={`py-2 px-3 rounded cursor-pointer hover:bg-gray-300 ${selectedChannel && selectedChannel._id === channel._id ? 'bg-gray-300 font-semibold' : ''}`}
                    >
                        Channel: {channel.name}
                    </li>
                ))}
            </ul>

            {!isAddingChannel ? (
                <button
                    onClick={handleAddChannelClick}
                    className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    + Add Channel
                </button>
            ) : (
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Channel Name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={handleCreateChannel}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Create
                        </button>
                        <button
                            onClick={handleCancelAddChannel}
                            className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    const MessageSectionComponent = () => {
        if (!selectedChannel) {
            return <div className="text-gray-500 italic">Select a channel to view messages.</div>;
        }

        return (
            <div>
                <h2 className="text-xl font-semibold mb-4">Channel: {selectedChannel.name}</h2>
                {loadingUsername ? (
                    <p>Loading username...</p> // Or display loading indicator if preferred
                ) : (
                    <p className="mb-2 text-sm text-gray-600">Logged in as: {username || 'Unknown'}</p>
                )}

                {/* Message Display Area */}
                <div className="overflow-y-auto h-[calc(100vh-300px)] p-2 border rounded bg-white shadow-sm"> {/* Adjusted height */}
                    {messages.map(message => (
                        <Message key={message._id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input Area */}
                <div className="mt-4">
                    <textarea
                        placeholder="Type your message..."
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="3"
                        value={messageInput}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={handleSendMessageClick}
                        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Send
                    </button>
                </div>
            </div>
        );
    };


    return (
        <div className="flex h-screen bg-gray-100">
            {/* Channel List Sidebar */}
            <div className="w-64 bg-gray-200 p-4">
                <ChannelListComponent />
            </div>

            {/* Message Section */}
            <div className="flex-1 p-4 flex flex-col justify-between">
                <MessageSectionComponent />
            </div>
        </div>
    );
};

export default CommunicationPlan;