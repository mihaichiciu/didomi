import { PrismaClient } from '@prisma/client';
import { ConflictError, NotFoundError } from '@/utils/apiErrors';

const prisma = new PrismaClient();

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    consents: user.consents,
  };
};

export const createUser = async (email: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ConflictError('Email already exists');
  }

  const user = await prisma.user.create({
    data: {
      email,
    },
  });

  return {
    id: user.id,
    email: user.email,
    consents: user.consents,
  };
};

export const deleteUser = async (id: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  await prisma.user.delete({
    where: {
      id,
    },
  });
};
