import { Users, Role as RoleType } from '@prisma/client'

export type UserResponse = {
   id: number;
   username: string;
   email: string;
   password: string;
   role: RoleType;
   approved: boolean;
   createdAt: Date;
   updatedAt: Date;
}

export type LoginResponse = {
   accessToken: string;
}

export type UserRequest = {
   username: string;
   email: string;
   password: string;
   role: RoleType;
   approved: boolean;
}

export type LoginUserRequest = {
   email: string;
   password: string;
}

export type UserResponseArray<T> = {
   message: string;
   data: T[];
}

export function toUserResponse(user: Users): UserResponse {
   return {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      approved: user.approved,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
   }
}
