import { NextFunction, Request, Response } from "express";
import { LocationRequest } from "../model/locationModel";
import { LocationService } from "../service/locationService";

export class LocationController {

   static async create(req: Request, res: Response, next: NextFunction) {
      try {
         const request: LocationRequest = req.body as LocationRequest;
         const response = await LocationService.create(request)
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
         const response = await LocationService.findAll()
         res.status(200).json(response)
      } catch (e) {
         next(e)
      }
   }

   static async findOne(req: Request, res: Response, next: NextFunction) {
      try {
         const locationId = Number(req.params.id)
         const response = await LocationService.findOne(locationId)
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
         const locationId = Number(req.params.id)
         const request: LocationRequest = req.body as LocationRequest;
         const response = await LocationService.update(locationId, request)
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
         const locationId = Number(req.params.id)
         await LocationService.remove(locationId)
         res.status(200).json({ message: 'Success' })
      } catch (e) {
         next(e)
      }
   }
}