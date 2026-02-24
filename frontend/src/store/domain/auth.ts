export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: UserRole;
  username: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = "admin" | "manager" | "user" | "guest" | string;

export interface AuthState {
  isAuth: boolean;
  user: User | null;
  token: string | null;
}
