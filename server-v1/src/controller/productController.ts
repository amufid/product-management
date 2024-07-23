import { NextFunction, Request, Response } from "express";
import { ProductRequest, SearchProductRequest } from "../model/productModel";
import { ProductsService } from "../service/productService";

export class ProductsController {

   static async create(req: Request, res: Response, next: NextFunction) {
      try {
         const request: ProductRequest = req.body as ProductRequest;
         const response = await ProductsService.create(request);
         res.status(201).json({
            message: 'Success',
            data: response
         })
      } catch (e) {
         next(e)
      }
   }

   static async uploadImage(req: Request, res: Response, next: NextFunction) {
      try {
         const cloudinaryUrl: string = req.body.cloudinaryUrl;
         res.status(201).json({
            message: 'Success',
            photo: cloudinaryUrl
         })
      } catch (e) {
         next(e)
      }
   }

   static async findAll(req: Request, res: Response, next: NextFunction) {
      try {
         const request: SearchProductRequest = {
            name: req.query.name as string,
            sku: req.query.sku as string,
            createdAt: req.query.createdAt as string,
            updatedAt: req.query.updatedAt as string,
            page: req.query.page ? Number(req.query.page) : 1,
            size: req.query.size ? Number(req.query.size) : 10,
         }

         const response = await ProductsService.findAll(request);
         res.status(200).json(response)
      } catch (e) {
         next(e)
      }
   }

   static async findOne(req: Request, res: Response, next: NextFunction) {
      try {
         const productId = Number(req.params.id)
         const response = await ProductsService.findOne(productId);
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
         const request: ProductRequest = req.body as ProductRequest;
         const productId = Number(req.params.id)
         const response = await ProductsService.update(productId, request);
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
         const productId = Number(req.params.id)
         await ProductsService.remove(productId);
         res.status(200).json({
            message: 'Success'
         })
      } catch (e) {
         next(e)
      }
   }

}