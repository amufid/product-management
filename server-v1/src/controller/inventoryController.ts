import { NextFunction, Request, Response } from "express";
import { InventoryRequest } from "../model/inventoryModel";
import { InventoryService } from "../service/inventoryService";

export class InventoryController {

   static async create(req: Request, res: Response, next: NextFunction) {
      try {
         const request: InventoryRequest = req.body as InventoryRequest
         const response = await InventoryService.create(request)
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
         const response = await InventoryService.findAll()
         res.status(201).json(response)
      } catch (e) {
         next(e)
      }
   }

   static async findOne(req: Request, res: Response, next: NextFunction) {
      try {
         const inventoryId = Number(req.params.id)
         const response = await InventoryService.findOne(inventoryId)
         res.status(201).json({
            message: 'Success',
            data: response
         })
      } catch (e) {
         next(e)
      }
   }

   static async update(req: Request, res: Response, next: NextFunction) {
      try {
         const inventoryId = Number(req.params.id)
         const request: InventoryRequest = req.body as InventoryRequest
         const response = await InventoryService.update(inventoryId, request)
         res.status(201).json({
            message: 'Success',
            data: response
         })
      } catch (e) {
         next(e)
      }
   }

   static async remove(req: Request, res: Response, next: NextFunction) {
      try {
         const inventoryId = Number(req.params.id)
         const response = await InventoryService.remove(inventoryId)
         res.status(201).json({ message: 'Success' })
      } catch (e) {
         next(e)
      }
   }
}
