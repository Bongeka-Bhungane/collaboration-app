export type UserRole = "submitter" | "reviewer";

export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: UserRole;
    pictureUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export type NewUser = Omit<User, "id" | "createdAt" | "updatedAt">;

export type UpdateUser = Pick<User, "name" | "email" | "pictureUrl">;