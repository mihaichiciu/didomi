import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const consentSchema = z.object({
  id: z.enum(['email_notifications', 'sms_notifications'], {
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_enum_value) {
        return { message: 'Invalid consent ID' };
      }
      return { message: ctx.defaultError };
    },
  }),
  enabled: z.boolean(),
});

export const createEventSchema = z.object({
  user: z.object({
    id: z.string().uuid('Invalid user ID format'),
  }),
  consents: z
    .array(consentSchema)
    .min(1, 'Consents array cannot be empty')
    .superRefine((consents, ctx) => {
      const uniqueIds = new Set<string>();
      for (const consent of consents) {
        if (uniqueIds.has(consent.id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate consent ID found: ${consent.id}`,
            path: ['consents', consents.indexOf(consent), 'id'],
          });
        }
        uniqueIds.add(consent.id);
      }
    }),
});

export const userConsentsSchema = z.array(consentSchema);

export const updateUserSchema = z.object({
  consents: userConsentsSchema,
});
