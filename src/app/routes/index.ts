import express from 'express';

import { AuthRoutes } from '../modules/auth/auth.route';
import { eventsRoute } from '../modules/events/events.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/events',
    route: eventsRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
