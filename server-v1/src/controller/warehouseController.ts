import { NextFunction, Request, Response } from "express";
import { WarehouseRequest } from "../model/warehouseModel";
import { WarehouseService } from "../service/warehouseService";

export class WarehouseController {

   static async create(req: Request, res: Response, next: NextFunction) {
      try {
         const request: WarehouseRequest = req.body as WarehouseRequest
         const response = await WarehouseService.create(request)
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
         const response = await WarehouseService.findAll()
         res.status(200).json(response)
      } catch (e) {
         next(e)
      }
   }

   static async findOne(req: Request, res: Response, next: NextFunction) {
      try {
         const warehouseId = Number(req.params.id)
         const response = await WarehouseService.findOne(warehouseId)
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
         const warehouseId = Number(req.params.id)
         const request: WarehouseRequest = req.body as WarehouseRequest
         const response = await WarehouseService.update(warehouseId, request)
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
         const warehouseId = Number(req.params.id)
         await WarehouseService.remove(warehouseId)
         res.status(200).json({ message: 'Success' })
      } catch (e) {
         next(e)
      }
   }
}