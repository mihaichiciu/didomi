import { Request, Response } from 'express';
import * as userService from '@/services/userService';
import { createUserSchema } from '@/utils/validationSchemas';
import asyncHandler from '@/utils/asyncHandler';

export const getUsers = asyncHandler(async (_, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  res.json(user);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email } = createUserSchema.parse(req.body);
  const user = await userService.createUser(email);
  res.status(201).json(user);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await userService.deleteUser(id);
  res.status(204).send();
});
