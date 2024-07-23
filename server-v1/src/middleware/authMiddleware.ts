import { NextFunction, Request, Response } from "express";
import { ResponseError } from "../lib/responseError";
import jwt from 'jsonwebtoken'
import { prisma } from "../lib/prisma";

declare module 'express-serve-static-core' {
   interface Request {
      userLogged?: {
         id: number;
         email: string;
      }
   }
}

interface JwtPayload {
   id: number;
}

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
   try {
      if (!req.headers.authorization) {
         throw new ResponseError(401, 'Unauthorized')
      }

      const accessToken = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as JwtPayload

      const findUser = await prisma.users.findUnique({
         where: { id: decoded.id }
      })

      if (!findUser) {
         throw new ResponseError(401, 'Unauthorized')
      }

      req.userLogged = {
         id: findUser.id,
         email: findUser.email
      }

      next()
   } catch (e) {
      next(e)
   }
}

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = req.userLogged!.id

      const findUser = await prisma.users.findUnique({
         where: { id: user }
      })

      if (findUser?.role === 'ADMIN') {
         next()
      } else {
         throw new ResponseError(401, 'Unauthorized')
      }
   } catch (e) {
      next(e)
   }
}
