import { events } from './events.model';
import { IEvent, IEventFilterableField } from './events.interface';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

// create events
const createEvent = async (eventsData: IEvent): Promise<IEvent | null> => {
  const result = await events.create(eventsData);
  return result;
};

// get all events with filters
const getAllEvents = async (
  filter: IEventFilterableField,
): Promise<IEvent[]> => {
  const { searchTerm, dateRange, eventDate } = filter;

  const query: any = {};

  // Full-text search on multiple fields
  if (searchTerm) {
    query.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { location: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  // Filter by specific event date (exact match)
  if (eventDate) {
    const date = new Date(eventDate);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    query.dateTime = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  // Filter by date range (overrides eventDate if both are passed)
  if (dateRange) {
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (dateRange) {
      case 'currentMonth': {
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      }
      case 'currentWeek': {
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      }
      case 'currentYear': {
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      }
      case 'lastMonth': {
        const lastMonth = subMonths(now, 1);
        startDate = startOfMonth(lastMonth);
        endDate = endOfMonth(lastMonth);
        break;
      }
      case 'lastWeek': {
        const lastWeek = subWeeks(now, 1);
        startDate = startOfWeek(lastWeek, { weekStartsOn: 1 });
        endDate = endOfWeek(lastWeek, { weekStartsOn: 1 });
        break;
      }
      case 'lastYear': {
        const lastYear = subYears(now, 1);
        startDate = startOfYear(lastYear);
        endDate = endOfYear(lastYear);
        break;
      }
    }

    if (startDate && endDate) {
      query.dateTime = {
        $gte: startDate,
        $lte: endDate,
      };
    }
  }

  const result = await events
    .find(query)
    .populate('owner')
    .sort({ dateTime: -1 })
    .exec();

  return result;
};

// My events for a specific user
const myEvents = async (userId: string): Promise<IEvent[]> => {
  const result = await events.find({ owner: userId }).populate('owner').exec();
  return result;
};

const getOneEvent = async (eventId: string): Promise<IEvent> => {
  const result = await events.findById(eventId);
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Event not found');
  }

  return result;
};

// update events
const updateEvent = async (
  userId: string,
  eventId: string,
  eventData: Partial<IEvent>,
): Promise<IEvent | null> => {
  const isExistEvent = await events.findById(eventId).exec();
  if (!isExistEvent) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Event not found');
  }

  if (isExistEvent.owner.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this event',
    );
  }
  const result = await events
    .findByIdAndUpdate(eventId, eventData, { new: true })
    .exec();
  return result;
};

const updateAttendees = async (eventId: string, userId: string) => {
  const isExistEvent = await events.findById({ _id: eventId }).exec();

  if (!isExistEvent) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Event not found');
  }

  isExistEvent.attendeeCount = isExistEvent.attendeeCount + 1;

  isExistEvent.joinedUsers.push(userId as any);

  await isExistEvent.save();
};

// delete events
const deleteEvent = async (
  eventId: string,
  userId: string,
): Promise<IEvent | null> => {
  const isExistEvent = await events.findById(eventId).exec();

  if (!isExistEvent) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Event not found');
  }

  if (isExistEvent.owner.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete this event',
    );
  }

  await events.findByIdAndDelete(eventId).exec();

  return isExistEvent;
};

export const eventService = {
  createEvent,
  getAllEvents,
  getOneEvent,
  myEvents,
  updateEvent,
  updateAttendees,
  deleteEvent,
};
