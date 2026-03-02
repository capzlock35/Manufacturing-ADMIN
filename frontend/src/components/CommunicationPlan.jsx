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
    const [username, setUsername] = useState('');
    const [loadingUsername, setLoadingUsername] = useState(true);
    const [newChannelName, setNewChannelName] = useState('');
    const [isAddingChannel, setIsAddingChannel] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

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

    useEffect(() => {
        fetchChannels();
        fetchUsername();
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

    const handleChannelSelect = (channel) => {
        setSelectedChannel(channel);
    };

    const handleSendMessage = async (messageContent) => {
        if (!selectedChannel) return;

        if (!username && !loadingUsername) {
            alert("Username could not be determined. Please refresh the page or contact support.");
            return;
        }

        try {
            const response = await axios.post(`${baseURL}/messages`, {
                channelId: selectedChannel._id,
                username: username,
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
        // Determine if this message is from the current user
        const isCurrentUserMessage = message.username === username;

        // Determine the display username - "YOU" for current user, actual username for others
        const displayUsername = isCurrentUserMessage ? "YOU" : message.username;

        return (
            <div
                className={`mb-2 p-3 rounded-lg shadow-sm ${
                    isCurrentUserMessage
                        ? 'bg-blue-200 self-end text-right'
                        : 'bg-gray-100 self-start text-left'
                }`}
            >
                <div className="font-semibold">{displayUsername}</div>
                <div className="text-gray-700">{message.content}</div>
                <div className="text-sm text-gray-500 mt-1">
                    <TimeAgo date={message.timestamp} />
                </div>
            </div>
        );
    };

    const ChannelListComponent = ({ channels, onSelectChannel, onAddChannel, selectedChannel }) => { // Add props
        const [newChannelName, setNewChannelName] = useState('');
        const [isAddingChannel, setIsAddingChannel] = useState(false);
        const [editingChannel, setEditingChannel] = useState(null);
        const [editChannelName, setEditChannelName] = useState('');

        const handleAddChannelClick = () => {
            setIsAddingChannel(true);
        };

        const handleCreateChannel = () => {
            if (newChannelName.trim()) {
                onAddChannel(newChannelName);
                setNewChannelName('');
                setIsAddingChannel(false);
            }
        };

        const handleCancelAddChannel = () => {
            setIsAddingChannel(false);
            setNewChannelName('');
        };

        const handleDeleteChannel = async (channelId) => {
            if (window.confirm("Are you sure you want to delete this channel? This action is irreversible.")) {
                try {
                    await axios.delete(`${baseURL}/channels/${channelId}`);
                    fetchChannels();
                    if (selectedChannel && selectedChannel._id === channelId) {
                        setSelectedChannel(null);
                        setMessages([]);
                    }
                } catch (error) {
                    console.error("Error deleting channel:", error);
                    alert("Failed to delete channel.");
                }
            }
        };

        const handleStartEdit = (channel) => {
            setEditingChannel(channel);
            setEditChannelName(channel.name);
        };

        const handleCancelEdit = () => {
            setEditingChannel(null);
            setEditChannelName('');
        };

        const handleUpdateChannel = async (channelId) => {
            if (editChannelName.trim()) {
                try {
                    const response = await axios.put(`${baseURL}/channels/${channelId}`, { name: editChannelName });
                    if (response.status === 200) {
                        fetchChannels();
                        setEditingChannel(null);
                        if (selectedChannel && selectedChannel._id === channelId) {
                            onSelectChannel(response.data); // Use onSelectChannel to update selectedChannel
                        }
                    }
                } catch (error) {
                    console.error("Error updating channel:", error);
                    alert("Failed to update channel name.");
                }
            } else {
                alert("Channel name cannot be empty.");
            }
        };


       return (
            <div className="flex flex-col h-full">
                <h2 className="text-xl font-semibold mb-4 flex-shrink-0">Channels</h2>
                <ul className="overflow-y-auto flex-grow mb-4"> {/* Added overflow */}
                    {channels.map(channel => (
                        <li
                            key={channel._id}
                            className={`py-2 px-3 rounded cursor-pointer hover:bg-gray-300 group relative ${selectedChannel && selectedChannel._id === channel._id ? 'bg-blue-100 font-semibold' : ''}`} // Highlight selected
                            onClick={() => !(editingChannel && editingChannel._id === channel._id) && onSelectChannel(channel)} // Prevent select when editing
                        >
                            {editingChannel && editingChannel._id === channel._id ? (
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={editChannelName}
                                        onChange={(e) => setEditChannelName(e.target.value)}
                                        onClick={(e) => e.stopPropagation()} // Prevent triggering li onClick
                                        className="shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm flex-grow"
                                        autoFocus // Focus when edit starts
                                    />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleUpdateChannel(channel._id); }}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:shadow-outline"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                                        className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:shadow-outline"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <span className="block truncate"> {/* Added truncate */}
                                         {channel.name} {/* Simpler display */}
                                    </span>
                                    {/* Action buttons appear on hover */}
                                     <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleStartEdit(channel); }}
                                            className="p-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                                            aria-label="Edit Channel"
                                            title="Edit"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.585 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteChannel(channel._id); }}
                                            className="p-1 text-red-500 hover:text-red-700 focus:outline-none"
                                            aria-label="Delete Channel"
                                            title="Delete"
                                        >
                                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                             <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Add Channel UI */}
                 <div className="flex-shrink-0">
                    {!isAddingChannel ? (
                        <button
                            onClick={handleAddChannelClick}
                            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            + Add Channel
                        </button>
                    ) : (
                        <div className="mt-2 p-2 border rounded bg-gray-50">
                            <input
                                type="text"
                                placeholder="New channel name..."
                                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2 text-sm"
                                value={newChannelName}
                                onChange={(e) => setNewChannelName(e.target.value)}
                                autoFocus
                            />
                            <div className="flex space-x-2 justify-end">
                                <button
                                    onClick={handleCreateChannel}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm focus:outline-none focus:shadow-outline"
                                >
                                    Create
                                </button>
                                <button
                                    onClick={handleCancelAddChannel}
                                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded text-sm focus:outline-none focus:shadow-outline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                 </div>
            </div>
        );
    };

   // Your MessageSectionComponent definition needs modification
   const MessageSectionComponent = ({ channel, messages, onSendMessage, username, loadingUsername, currentUserActualUsername /* pass this down */, messagesEndRef /* pass ref down */ }) => {
       // Move state and handlers here
       const [messageInput, setMessageInput] = useState('');

       const handleInputChange = (e) => {
           setMessageInput(e.target.value);
       };

       const handleSendMessageClick = () => {
           if (messageInput.trim() && onSendMessage) {
               onSendMessage(messageInput); // Call the prop passed from parent
               setMessageInput(''); // Clear the local input state
           }
       };

       const handleKeyDown = (e) => {
           if (e.key === 'Enter' && !e.shiftKey) {
               e.preventDefault(); // Prevent newline in textarea
               handleSendMessageClick();
           }
       };

        // Define Message component here if only used here, or import if separate
         const Message = ({ message }) => {
            // Use the actual username passed down for comparison
            const isCurrentUserMessage = message.username === currentUserActualUsername;
            // Display "YOU" or the username
            const displayUsername = isCurrentUserMessage ? "YOU" : message.username || "Unknown";

            return (
                <div
                    className={`mb-2 p-3 rounded-lg shadow-sm flex flex-col ${
                        isCurrentUserMessage
                            ? 'bg-blue-100 self-end items-end'
                            : 'bg-gray-100 self-start items-start'
                    }`}
                    style={{ maxWidth: '75%', wordWrap: 'break-word' }} // Ensure long words break
                >
                    <div className={`font-semibold text-sm ${isCurrentUserMessage ? 'text-blue-800' : 'text-gray-800'}`}>{displayUsername}</div>
                    <div className={`text-gray-900 mt-1 ${isCurrentUserMessage ? 'text-right' : 'text-left'}`}>{message.content}</div>
                    <div className="text-xs text-gray-500 mt-1 self-stretch text-right"> {/* Time always bottom right */}
                        <TimeAgo date={message.timestamp} />
                    </div>
                </div>
            );
        };


       if (!channel) {
           return <div className="flex items-center justify-center h-full text-gray-500 italic">Select or create a channel to start chatting.</div>;
       }

       return (
           <div className="flex flex-col h-full"> {/* Ensure takes full height */}
               {/* Header */}
               <div className="border-b pb-2 mb-4 flex-shrink-0">
                 <h2 className="text-xl font-semibold">#{channel.name}</h2>
                 {loadingUsername ? (
                     <p className="text-sm text-gray-500">Loading user info...</p>
                 ) : (
                     <p className="text-sm text-gray-600">
                         Logged in as: <span className="font-medium">{currentUserActualUsername || 'Unknown'}</span>
                     </p>
                 )}
               </div>

               {/* Message List */}
               <div className="overflow-y-auto flex-grow mb-4 flex flex-col p-2 space-y-2"> {/* Use flex-col for message alignment */}
                   {messages.length === 0 && (
                       <div className="text-center text-gray-400 italic mt-4">No messages in this channel yet.</div>
                   )}
                   {messages.map(msg => (
                       <Message key={msg._id} message={msg} currentUserActualUsername={currentUserActualUsername} />
                   ))}
                   <div ref={messagesEndRef} /> {/* Ref for scrolling */}
               </div>

               {/* Input Area */}
               <div className="mt-auto pt-4 border-t flex-shrink-0"> {/* Pushes input to bottom */}
                   <textarea
                       placeholder="Type your message... (Shift+Enter for newline)"
                       className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" // Added focus styles, disable resize
                       rows="3"
                       value={messageInput} // Use local state
                       onChange={handleInputChange} // Use local handler
                       onKeyDown={handleKeyDown} // Use local handler
                       disabled={loadingUsername || !username} // Disable if username not loaded
                   />
                   <button
                       onClick={handleSendMessageClick} // Use local handler
                       className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                       disabled={!messageInput.trim() || loadingUsername || !username} // Disable if no input or no user
                   >
                       Send Message
                   </button>
               </div>
           </div>
       );
   };


    // Main Render
    return (
        <div className="flex h-screen bg-gray-50"> {/* Changed bg color slightly */}
            {/* Channel List Sidebar */}
            <div className="w-64 bg-gray-100 p-4 border-r flex flex-col"> {/* Added flex-col */}
                 <ChannelListComponent
                    channels={channels}
                    onSelectChannel={handleChannelSelect}
                    onAddChannel={handleAddChannel}
                    selectedChannel={selectedChannel} // Pass selectedChannel for highlighting etc.
                    // Pass fetchChannels if needed inside ChannelListComponent for refresh after delete/update
                    // fetchChannels={fetchChannels}
                />
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 flex flex-col bg-white"> {/* Added bg-white */}
                <MessageSectionComponent
                    channel={selectedChannel}
                    messages={messages}
                    onSendMessage={handleSendMessage} // Pass the sender function
                    username={username} // Pass for display/logic if needed inside
                    loadingUsername={loadingUsername}
                    currentUserActualUsername={username} // Pass the actual username for comparison in Message
                    messagesEndRef={messagesEndRef} // Pass the ref
                />
            </div>
        </div>
    );
};

export default CommunicationPlan;