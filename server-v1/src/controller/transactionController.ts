import { NextFunction, Request, Response } from "express";
import { TransactionRequest } from "../model/transactionModel";
import { TransactionService } from "../service/transactionService";

export class TransactionController {

   static async create(req: Request, res: Response, next: NextFunction) {
      try {
         const request: TransactionRequest = req.body as TransactionRequest;
         const response = await TransactionService.create(request)
         res.status(201).json({
            message: 'Success',
            data: response
         })
      } catch (e) {
         next(e)
      }
   }

   static async findAll(req: Request, res: Response, next: NextFunction) {
      try {
         const response = await TransactionService.findAll()
         res.status(200).json(response)
      } catch (e) {
         next(e)
      }
   }

   static async findOne(req: Request, res: Response, next: NextFunction) {
      try {
         const transactionId = Number(req.params.id)
         const response = await TransactionService.findOne(transactionId)
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
         const transactionId = Number(req.params.id)
         const request: TransactionRequest = req.body as TransactionRequest;
         const response = await TransactionService.update(transactionId, request)
         res.status(200).json({
            message: 'Success',
            data: response
         })
      } catch (e) {
         next(e)
      }
   }

}