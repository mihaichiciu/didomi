import { Router } from 'express';
import { getUsers, getUserById, createUser, deleteUser } from '@/controllers/userController';
import asyncHandler from '@/utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getUsers));
router.get('/:id', asyncHandler(getUserById));
router.post('/', asyncHandler(createUser));
router.delete('/:id', asyncHandler(deleteUser));

export default router;
