import { PrismaClient, Prisma } from '@prisma/client';
import { NotFoundError, InternalServerError } from '@/utils/apiErrors';
import { ConsentChangeInput } from '@/types/types';

const prisma = new PrismaClient();

export const createEvent = async (userId: string, consentChanges: ConsentChangeInput[]) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const [event, _] = await prisma.$transaction(async (tx) => {
      const createdEvent = await tx.event.create({
        data: {
          userId,
          consents: consentChanges as unknown as Prisma.InputJsonValue,
        },
      });

      const currentUserConsents: ConsentChangeInput[] = (user.consents || []) as unknown as ConsentChangeInput[];
      const updatedConsentsMap = new Map<string, ConsentChangeInput>();
      currentUserConsents.forEach((consent) => updatedConsentsMap.set(consent.id, consent));
      consentChanges.forEach((change) => updatedConsentsMap.set(change.id, change));
      const updatedUserConsents = Array.from(updatedConsentsMap.values());

      const userUpdated = await tx.user.update({
        where: { id: userId },
        data: {
          consents: updatedUserConsents as unknown as Prisma.InputJsonValue,
        },
      });

      return [createdEvent, userUpdated];
    });

    return {
      id: event.id,
      user: { id: event.userId },
      consents: event.consents,
      createdAt: event.createdAt,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError('Failed to create event and update user consents due to an internal server error.');
  }
};
