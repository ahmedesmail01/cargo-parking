export type UserRole = "employee" | "admin";
export type LoginResponse = {
  token: string;
  user: { id: string; username: string; role: UserRole };
};
