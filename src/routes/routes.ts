import express from 'express';
import usersRouter from './users/users.routes.js';
import excercisesRouter from './excercises/excercises.routes.js';

const router = express.Router();

router.use('/users', usersRouter);
router.use('/excercises', excercisesRouter);

export default router;