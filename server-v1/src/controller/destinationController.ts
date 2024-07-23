import { NextFunction, Request, Response } from "express";
import { DestinationRequest } from "../model/destinationModel";
import { DestinationService } from "../service/destinationService";

export class DestinationController {

   static async create(req: Request, res: Response, next: NextFunction) {
      try {
         const request: DestinationRequest = req.body as DestinationRequest
         const response = await DestinationService.create(request)
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
         const response = await DestinationService.findAll()
         res.status(200).json(response)
      } catch (e) {
         next(e)
      }
   }

   static async findOne(req: Request, res: Response, next: NextFunction) {
      try {
         const destinationId = Number(req.params.id)
         const response = await DestinationService.findOne(destinationId)
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
         const destinationId = Number(req.params.id)
         const request: DestinationRequest = req.body as DestinationRequest
         const response = await DestinationService.update(destinationId, request)
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
         const destinationId = Number(req.params.id)
         await DestinationService.remove(destinationId)
         res.status(200).json({ message: 'Success' })
      } catch (e) {
         next(e)
      }
   }
}
