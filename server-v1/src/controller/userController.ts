import { NextFunction, Request, Response } from "express";
import { LoginUserRequest, UserRequest, } from "../model/userModel";
import { UserService } from "../service/userService";

export class UserController {

   static async register(req: Request, res: Response, next: NextFunction) {
      try {
         const request: UserRequest = req.body as UserRequest
         const response = await UserService.register(request)
         res.status(201).json({
            message: 'Success',
            data: response
         })
      } catch (e) {
         next(e)
      }
   }

   static async login(req: Request, res: Response, next: NextFunction) {
      try {
         const request: LoginUserRequest = req.body as LoginUserRequest
         const response = await UserService.login(request)
         res.status(200).json({
            message: 'Success',
            accessToken: response
         })
      } catch (e) {
         next(e)
      }
   }

   static async findAll(req: Request, res: Response, next: NextFunction) {
      try {
         const response = await UserService.findAll()
         res.status(200).json(response)
      } catch (e) {
         next(e)
      }
   }

   static async findOne(req: Request, res: Response, next: NextFunction) {
      try {
         const userId = Number(req.params.id)
         const response = await UserService.findOne(userId)
         res.status(200).json({
            message: 'Success',
            data: response
         })
      } catch (e) {
         next(e)
      }
   }

   static async update(req: Request, res: Response, next: NextFunction) {
      try {
         const userId = Number(req.userLogged!.id)
         const request: UserRequest = req.body as UserRequest
         const response = await UserService.update(userId, request)
         res.status(200).json({
            message: 'Success',
            data: response
         })
      } catch (e) {
         next(e)
      }
   }

   static async remove(req: Request, res: Response, next: NextFunction) {
      try {
         const userId = Number(req.params.id)
         await UserService.remove(userId)
         res.status(200).json({ message: 'Success' })
      } catch (e) {
         next(e)
      }
   }
}
