import React, { useState, useEffect } from 'react';
import { Trash, Edit, Calendar, Star, CheckSquare, MessageCircle, PlusCircle, X } from 'lucide-react';
import axios from 'axios';

const WorkflowIdentification = () => {
  const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/tasks'
        : 'http://localhost:7690/api/tasks';

  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    notes: []
  });
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [role, setRole] = useState(null); // State to store user role

  // Fetch user role from localStorage on component mount
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
  }, []);

  // Fetch tasks from API
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(baseURL);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Error loading tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, task = null) => {
    if (mode === 'edit' && task) {
      // Format the dueDate for the input field (yyyy-mm-dd)
      const formattedTask = {
        ...task,
        dueDate: new Date(task.dueDate).toISOString().split('T')[0]
      };
      setCurrentTask(formattedTask);
      setEditMode(true);
    } else {
      setCurrentTask({
        title: "",
        description: "",
        priority: "medium",
        dueDate: new Date().toISOString().split('T')[0],
        completed: false,
        notes: [] // Initialize notes array when adding a new task
      });
      setEditMode(false);
    }
    setIsModalOpen(true);
  };

  const openNotesModal = (task) => {
    setCurrentTask(task);
    setIsNotesModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeNotesModal = () => {
    setIsNotesModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask({ ...currentTask, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCurrentTask({ ...currentTask, [name]: checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        const response = await axios.put(`${baseURL}/${currentTask._id}`, currentTask);
        setTasks(tasks.map(task => task._id === currentTask._id ? response.data : task));
      } else {
        const response = await axios.post(baseURL, currentTask);
        setTasks([response.data, ...tasks]);
      }
      closeModal();
    } catch (err) {
      console.error('Error saving task:', err);
      alert('Error saving task. Please try again.');
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${baseURL}/${id}`);
        setTasks(tasks.filter(task => task._id !== id));
      } catch (err) {
        console.error('Error deleting task:', err);
        alert('Error deleting task. Please try again.');
      }
    }
  };

  const toggleComplete = async (id) => {
    try {
      const taskToUpdate = tasks.find(task => task._id === id);
      const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

      const response = await axios.put(`${baseURL}/${id}`, updatedTask);
      setTasks(tasks.map(task => task._id === id ? response.data : task));
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Error updating task. Please try again.');
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await axios.post(`${baseURL}/${currentTask._id}/notes`, { text: newNote });

      // Update the tasks array with the updated task containing the new note
      setTasks(tasks.map(task => task._id === currentTask._id ? response.data : task));

      // Update the current task with the new notes
      setCurrentTask(response.data);

      // Clear the new note input
      setNewNote("");
    } catch (err) {
      console.error('Error adding note:', err);
      alert('Error adding note. Please try again.');
    }
  };

  const deleteNote = async (taskId, noteId) => {
    try {
      const response = await axios.delete(`${baseURL}/${taskId}/notes/${noteId}`);

      // Update the tasks array with the updated task
      setTasks(tasks.map(task => task._id === taskId ? response.data : task));

      // Update the current task with the updated notes
      setCurrentTask(response.data);
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Error deleting note. Please try again.');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "All") return true;
    return task.priority === filter.toLowerCase();
  });

  const getRelativeTime = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    const taskDate = new Date(dateString).toISOString().split('T')[0];

    if (taskDate === today) return "Today";

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    if (taskDate === yesterdayString) return "Yesterday";

    const diffTime = Math.abs(new Date() - new Date(dateString));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // New function to format due date
  const formatDueDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }; // You can adjust the format here
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Tasks</h1>
          {/* Conditionally render "Add New Task" button based on role */}
          {role === 'superadmin' && (
            <button
              onClick={() => openModal('add')}
              className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-full transition-colors"
            >
              Add a new Task
            </button>
          )}
        </div>

        <div className="mb-6">
          <div className="flex space-x-2 justify-end">
            <button
              onClick={() => setFilter("All")}
              className={`px-4 py-1 rounded ${filter === "All" ? "bg-gray-200 text-gray-800" : "bg-white text-gray-600"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("Low")}
              className={`px-4 py-1 rounded ${filter === "Low" ? "bg-gray-200 text-gray-800" : "bg-white text-gray-600"}`}
            >
              Low
            </button>
            <button
              onClick={() => setFilter("Medium")}
              className={`px-4 py-1 rounded ${filter === "Medium" ? "bg-gray-200 text-gray-800" : "bg-white text-gray-600"}`}
            >
              Medium
            </button>
            <button
              onClick={() => setFilter("High")}
              className={`px-4 py-1 rounded ${filter === "High" ? "bg-gray-200 text-gray-800" : "bg-white text-gray-600"}`}
            >
              High
            </button>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No tasks found. Create a new task to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map(task => {
              const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
              return (
                <div
                  key={task._id}
                  className={`rounded-lg shadow p-4 ${task.completed ? 'bg-green-100' : isOverdue ? 'bg-red-100' : 'bg-white'}`}
                >
                  <div className="mb-2">
                    <h2 className="text-xl font-semibold">{task.title}</h2>
                    <p className="text-gray-600">{task.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      task.priority === 'low' ? 'text-green-600' :
                      task.priority === 'medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {task.priority}
                    </span>
                    {/* Use formatDueDate here */}
                    <div className="text-gray-500 text-sm">Due Date: {formatDueDate(task.dueDate)}</div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-2">
                      {/* Conditionally render "Mark Complete/Incomplete" button */}
                      <button
                        onClick={() => { // Modified onClick handler
                          if (role === 'superadmin') {
                            toggleComplete(task._id);
                          } else {
                            // Optionally, you can add a visual feedback for non-Superadmins
                            // e.g., alert('Only Superadmins can change task completion status.');
                            console.log('Completion status change disabled for your role.');
                          }
                        }}
                        className={`p-1 rounded ${task.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                        title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        <CheckSquare size={18} />
                      </button>

                      {/* Conditionally render "Edit" button */}
                      {role === 'superadmin' && (
                        <button
                          onClick={() => openModal('edit', task)}
                          className="p-1 rounded bg-blue-100 text-blue-600"
                          title="Edit task"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                      {/* Conditionally render "Delete" button */}
                      {role === 'superadmin' && (
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="p-1 rounded bg-red-100 text-red-600"
                          title="Delete task"
                        >
                          <Trash size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => openNotesModal(task)}
                        className="p-1 rounded bg-purple-100 text-purple-600"
                        title="View notes"
                      >
                        <MessageCircle size={18} />
                        {/* {task.notes && task.notes.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                            {task.notes.length}
                          </span>
                        )} */}
                      </button>
                    </div>
                    <div className="text-gray-500 text-xs">
                      Created: {new Date(task.dateCreated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
            {role === 'superadmin' && (
              <div
                className="bg-white rounded-lg shadow p-4 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50"
                onClick={() => openModal('add')}
              >
                <div className="text-center">
                  <p className="text-lg text-gray-500">Add New Task</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={handleSubmit}>
              {/* ... (Task Modal Form Fields - Title, Description, Priority, Due Date, Completed) ... */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  type="text"
                  name="title"
                  value={currentTask.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  name="description"
                  value={currentTask.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
                  Priority
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="priority"
                  name="priority"
                  value={currentTask.priority}
                  onChange={handleInputChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
                  Due Date
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="dueDate"
                  type="date"
                  name="dueDate"
                  value={currentTask.dueDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="completed"
                    checked={currentTask.completed}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700 text-sm font-bold">Task Completed</span>
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  {editMode ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {isNotesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Notes for "{currentTask.title}"</h2>
              <button onClick={closeNotesModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-grow mb-4">
              {(!currentTask.notes || currentTask.notes.length === 0) ? (
                <div className="text-gray-500 text-center py-8">
                  No notes yet. Add a note below.
                </div>
              ) : (
                <div className="space-y-3">
                  {currentTask.notes.map(note => (
                    <div key={note._id} className="bg-gray-100 p-3 rounded-lg relative group">
                      <p className="pr-6 note-text">{note.text}</p>
                      <button
                        onClick={() => deleteNote(currentTask._id, note._id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash size={16} />
                      </button>
                      <div className="text-gray-400 text-xs mt-2">
                        {formatDate(note.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-auto">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-grow shadow appearance-none border rounded-l py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onKeyPress={(e) => e.key === 'Enter' && addNote()}
                />
                <button
                  onClick={addNote}
                  className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-r"
                  disabled={!newNote.trim()}
                >
                  <PlusCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowIdentification;