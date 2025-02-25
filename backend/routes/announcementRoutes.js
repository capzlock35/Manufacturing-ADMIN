import express from 'express';
import { createAnnouncement, getAllAnnouncements, getAnnouncementById, updateAnnouncement, deleteAnnouncement } from "../controller/announcementController.js";

const announcementRouter = express.Router();

announcementRouter.post('/create', createAnnouncement); // Route for CREATE - POST to /api/announcements/create
announcementRouter.get('/', getAllAnnouncements);   // Route for READ ALL - GET to /api/announcements/get
announcementRouter.get('/:id', getAnnouncementById);  // Route for READ ONE - GET to /api/announcements/:id
announcementRouter.put('/:id', updateAnnouncement);  // Route for UPDATE - PUT to /api/announcements/:id
announcementRouter.delete('/:id', deleteAnnouncement); // Route for DELETE - DELETE to /api/announcements/:id

export default announcementRouter;