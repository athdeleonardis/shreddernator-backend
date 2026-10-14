import express from 'express';
import usersRouter from './users/routing-users.js';
import excercisesRouter from './excercises/routing-excercises.js';

const router = express.Router();

router.use('/users', usersRouter);
router.use('/excercises', excercisesRouter);

export default router;