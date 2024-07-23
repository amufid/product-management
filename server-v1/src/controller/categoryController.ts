import { NextFunction, Request, Response } from "express";
import { CategoryRequest } from "../model/categoryModel";
import { CategoryService } from "../service/categoryService";

export class CategoryController {

   static async create(req: Request, res: Response, next: NextFunction) {
      try {
         const request: CategoryRequest = req.body as CategoryRequest
         const response = await CategoryService.create(request)
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
         const response = await CategoryService.findAll()
         res.status(200).json(response)
      } catch (e) {
         next(e)
      }
   }

   static async findOne(req: Request, res: Response, next: NextFunction) {
      try {
         const categoryId = Number(req.params.id)
         const response = await CategoryService.findOne(categoryId)
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
         const categoryId = Number(req.params.id)
         const request: CategoryRequest = req.body as CategoryRequest
         const response = await CategoryService.update(categoryId, request)
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
         const categoryId = Number(req.params.id)
         await CategoryService.remove(categoryId)
         res.status(200).json({
            message: 'Success'
         })
      } catch (e) {
         next(e)
      }
   }
}
