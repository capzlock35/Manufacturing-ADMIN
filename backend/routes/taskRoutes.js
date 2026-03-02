import express from 'express';
const router = express.Router();
import * as taskController from '../controller/taskController.js'; // Assuming taskController.mjs is your controller file

// Route for all tasks
router.get('/', taskController.getAllTasks);

// Routes for individual tasks
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// Route for tasks by priority
router.get('/priority/:priority', taskController.getTasksByPriority);

// Routes for notes
router.post('/:id/notes', taskController.addNote); // Route to add a note
router.delete('/:taskId/notes/:noteId', taskController.deleteNote); // Route to delete a note
export default router;


