import { Schema, model } from 'mongoose';

import { IEvent } from './events.interface';

//  events Schema based on Events interface
const eventsSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    attendeeCount: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    joinedUsers: [
      {
        type: String || Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  },
);

//  events model
export const events = model<IEvent>('Event', eventsSchema);
