import { prisma } from "../lib/prisma";
import { ResponseError } from "../lib/responseError";
import {
   LoginResponse,
   LoginUserRequest,
   toUserResponse,
   UserRequest,
   UserResponse,
   UserResponseArray
} from "../model/userModel";
import { Validation } from "../validation/validation";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class UserService {

   static async register(request: UserRequest): Promise<UserResponse> {
      const registerRequest = Validation.validate(Validation.USER, request)

      const findUser = await prisma.users.findUnique({
         where: { email: registerRequest.email }
      })

      if (findUser) {
         throw new ResponseError(400, "Email is registered")
      }

      const hashPassword = await bcrypt.hash(registerRequest.password, 10)

      const setData = {
         ...registerRequest,
         ...{
            password: hashPassword,
            approved: false,
         }
      }

      const register = await prisma.users.create({
         data: setData
      })

      return toUserResponse(register);
   }

   static async login(request: LoginUserRequest): Promise<LoginResponse> {
      const loginRequest = Validation.validate(Validation.LOGIN, request)

      const findUser = await prisma.users.findUnique({
         where: { email: loginRequest.email }
      })

      if (!findUser) {
         throw new ResponseError(401, "Email or password wrong")
      }

      if (findUser.approved === false) {
         throw new ResponseError(401, "Invalid credentials")
      }

      const checkPassword = await bcrypt.compare(loginRequest.password, findUser.password)

      if (!checkPassword) {
         throw new ResponseError(401, "Email or password wrong")
      }

      const secret = process.env.JWT_SECRET

      const accessToken: any = jwt.sign({
         id: findUser.id
      }, secret!, {
         expiresIn: '7d'
      })

      return accessToken;
   }

   static async findAll(): Promise<UserResponseArray<UserResponse>> {
      const users = await prisma.users.findMany()
      return {
         message: 'Success',
         data: users.map(user => toUserResponse(user))
      }
   }

   static async findOne(userId: number): Promise<UserResponse> {
      const user = await prisma.users.findUnique({
         where: { id: userId }
      })

      if (!user) throw new ResponseError(404, 'User not found')

      return toUserResponse(user)
   }

   static async update(userId: number, request: UserRequest): Promise<UserResponse> {
      const updateRequest = Validation.validate(Validation.UserUpdate, request)

      await this.findOne(userId)

      const user = await prisma.users.update({
         where: {
            id: userId
         },
         data: updateRequest
      })

      return toUserResponse(user)
   }

   static async remove(userEmail: string): Promise<UserResponse> {
      const findUser = await prisma.users.findUnique({
         where: { email: userEmail }
      })

      if (!findUser) {
         throw new ResponseError(404, 'User not found')
      }
      const user = await prisma.users.delete({
         where: { email: findUser.email }
      })

      return toUserResponse(user)
   }

   static async approve(userEmail: string, request: UserRequest): Promise<UserResponse> {
      const approveRequest = Validation.validate(Validation.UserApprove, request)

      const findUser = await prisma.users.findUnique({
         where: { email: userEmail }
      })

      if (!findUser) {
         throw new ResponseError(404, 'User not found')
      }

      const user = await prisma.users.update({
         where: {
            id: findUser.id
         },
         data: approveRequest
      })

      return toUserResponse(user)
   }
}
