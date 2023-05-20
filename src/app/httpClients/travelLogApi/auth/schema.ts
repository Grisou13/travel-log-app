import { z } from 'zod';
import { User } from '../users/schema';

export const validator = z.object({
  username: z.string(),
  password: z.string(),
});
export type UserCredential = z.infer<typeof validator>;

export type AuthResponse = {
  token: string;
  user: User;
};
