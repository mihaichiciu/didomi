import { ConsentType } from '@prisma/client';

export interface ConsentChangeInput {
  id: ConsentType;
  enabled: boolean;
}

export interface EventBody {
  user: {
    id: string;
  };
  consents: ConsentChangeInput[];
}
