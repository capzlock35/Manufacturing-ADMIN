// route/messageRoute.js
import express from 'express';
import { getMessages, createMessage } from '../controller/messageController.js';

const router = express.Router();

router.get('/', getMessages);
router.post('/', createMessage); // For creating new messages

export default router;