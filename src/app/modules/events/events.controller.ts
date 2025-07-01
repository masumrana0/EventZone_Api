import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { eventService } from './events.service';
import { IEvent } from './events.interface';
import { eventFilterableFields } from './events.constant';
import { JwtPayload } from 'jsonwebtoken';

// Create events
const createEvent = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user as JwtPayload;

  const userId = user._id;
  const readyPayload = { owner: userId, ...payload };

  const result = await eventService.createEvent(readyPayload);

  sendResponse<IEvent>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Event created successfully!',
    data: result,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const filters = pick(query, eventFilterableFields) as any;

  const result = await eventService.getAllEvents(filters);

  sendResponse<IEvent[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Events fetched successfully!',
    data: result,
  });
});

const myEvents = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const userId = user?._id;

  const result = await eventService.myEvents(userId);

  sendResponse<IEvent[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My events fetched successfully!',
    data: result,
  });
});

const updateAttendees = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;

  const user = req.user;
  const userId = user?._id;

  await eventService.updateAttendees(eventId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendees updated successfully!',
    data: null,
  });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const user = req.user;
  const userId = user?._id; // Assuming user._id is the ID of the user making the request
  const eventData = req.body;

  await eventService.updateEvent(userId, eventId, eventData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Event updated successfully!',
    data: null,
  });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const user = req.user;
  const userId = user?._id;

  await eventService.deleteEvent(eventId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Event deleted successfully!',
    data: null,
  });
});

const getOneEvent = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;

  const result = await eventService.getOneEvent(eventId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Event deleted successfully!',
    data: result,
  });
});

export const eventController = {
  createEvent,
  getAllEvents,
  updateAttendees,
  deleteEvent,
  myEvents,
  updateEvent,
  getOneEvent,
};
