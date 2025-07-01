import express from 'express';
import { eventController } from './events.controller';
import publicAuth from '../../middlewares/publicAuth';

const router = express.Router();

// Create events
router.post('/', publicAuth(), eventController.createEvent);

// get all events
router.get('/', eventController.getAllEvents);

// get My all events
router.get('/my-events', publicAuth(), eventController.myEvents);

router.get('/one/:eventId', eventController.getOneEvent);

// update attendees
router.patch(
  '/attendees/:eventId',
  publicAuth(),
  eventController.updateAttendees,
);

// update events
router.patch('/:eventId', publicAuth(), eventController.updateEvent);

// delete events
router.delete('/:eventId', publicAuth(), eventController.deleteEvent);

export const eventsRoute = router;
