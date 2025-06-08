import { Request, Response } from 'express';
import * as eventService from '@/services/eventService';
import { createEventSchema } from '@/utils/validationSchemas';
import asyncHandler from '@/utils/asyncHandler';

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const { user, consents } = createEventSchema.parse(req.body);
  const event = await eventService.createEvent(user.id, consents);
  res.status(201).json(event);
});
