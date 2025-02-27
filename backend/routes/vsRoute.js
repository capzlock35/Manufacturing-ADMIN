import express from 'express';
import {getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement} from '../controller/vsController.js'

const vsrouter = express.Router();

vsrouter.get('/get', getAnnouncements);
vsrouter.post('/vscreate', createAnnouncement);
vsrouter.patch('/update:id', updateAnnouncement);
vsrouter.delete('/delete:id', deleteAnnouncement);

export default vsrouter;
