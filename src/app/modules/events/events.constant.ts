import { IEventFilterableField } from './events.interface';

export const eventFilterableFields: (keyof IEventFilterableField)[] = [
  'searchTerm',
  'dateRange',
  'eventDate',
];
