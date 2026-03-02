import Task from '../model/taskModel.js';


export const getAllTasks = async (req, res) => {
    try {
      const tasks = await Task.find().sort({ dateCreated: -1 });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
  };
  
  // Get a single task
  export const getTaskById = async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching task', error: error.message });
    }
  };
  
  // Create a new task
  export const createTask = async (req, res) => {
    try {
      const newTask = new Task(req.body);
      const savedTask = await newTask.save();
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(400).json({ message: 'Error creating task', error: error.message });
    }
  };
  
  // Update a task
  export const updateTask = async (req, res) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(400).json({ message: 'Error updating task', error: error.message });
    }
  };
  
  // Delete a task
  export const deleteTask = async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
  };
  
  // Get tasks by priority
  export const getTasksByPriority = async (req, res) => {
    try {
      const priority = req.params.priority.toLowerCase();
      if (!['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority level' });
      }
  
      const tasks = await Task.find({ priority }).sort({ dueDate: 1 });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
  };
  
  // Add a note to a task
  export const addNote = async (req, res) => {
    try {
      const { text } = req.body;
  
      if (!text) {
        return res.status(400).json({ message: 'Note text is required' });
      }
  
      const task = await Task.findById(req.params.id);
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      task.notes.push({ text });
      await task.save();
  
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ message: 'Error adding note', error: error.message });
    }
  };
  
  // Delete a note from a task
  export const deleteNote = async (req, res) => {
    try {
      const task = await Task.findById(req.params.taskId);
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Find and remove the note
      const noteExists = task.notes.id(req.params.noteId);
  
      if (!noteExists) {
        return res.status(404).json({ message: 'Note not found' });
      }
  
      noteExists.remove();
      await task.save();
  
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ message: 'Error deleting note', error: error.message });
    }
  };
  