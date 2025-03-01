import express from 'express';
import {getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement} from '../controller/vsController.js'
import verifyToken from '../middleware/verifyToken.js';

const vsrouter = express.Router();

vsrouter.get('/get',verifyToken, getAnnouncements);
vsrouter.post('/vscreate', createAnnouncement);
vsrouter.patch('/update/:id', updateAnnouncement);
vsrouter.delete('/delete/:id', deleteAnnouncement);

export default vsrouter;
