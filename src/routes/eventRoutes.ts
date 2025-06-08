import { Router } from 'express';
import { createEvent } from '@/controllers/eventController';
import asyncHandler from '@/utils/asyncHandler';

const router = Router();

router.post('/', asyncHandler(createEvent));

export default router;
