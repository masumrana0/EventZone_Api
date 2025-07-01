import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type IEvent = {
  id: string;
  title: string;
  owner: Types.ObjectId | IUser;
  attendeeCount: number;
  dateTime: Date;
  location: string;
  description: string;
  joinedUsers: Types.ObjectId[] | IUser[] | string[];
};

export type IEventFilterableField = {
  searchTerm: string;
  dateRange:
    | 'currentMonth'
    | 'currentMonth'
    | 'currentWeek'
    | 'currentWeek'
    | 'currentYear'
    | 'lastMonth'
    | 'lastWeek'
    | 'lastYear';
  eventDate: string;
};
