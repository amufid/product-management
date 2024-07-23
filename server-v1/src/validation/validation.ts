import { z, ZodType } from "zod";
import { ResponseError } from "../lib/responseError";

export class Validation {

   static validate<T>(schema: ZodType, data: T): T {
      return schema.parse(data)
   }

   // category 
   static readonly CATEGORY: ZodType = z.object({
      name: z.string().min(1)
   })

   // inventory 
   static readonly INVENTORY: ZodType = z.object({
      productId: z.number().min(1),
      locationId: z.number().min(1),
      quantity: z.number().min(1),
   })

   // location 
   static readonly LOCATION: ZodType = z.object({
      code: z.string().min(1),
      description: z.string().min(1),
   })

   // product 
   static readonly PRODUCT: ZodType = z.object({
      name: z.string().min(1),
      price: z.number().min(1),
      sku: z.string().min(1).max(20),
      description: z.string().optional(),
      quantity: z.number(),
      photo: z.string().optional(),
      categoryId: z.number().min(1),
   })

   // static readonly PRODUCT: ZodType = z.object({
   //    name: z.string().min(1),
   //    description: z.string().optional(),
   //    sku: z.string().min(1).max(20),
   //    price: z.string()
   //       .transform((val) => {
   //          const parsed = parseInt(val);
   //          if (isNaN(parsed)) {
   //             throw new ResponseError(400, "Invalid number");
   //          }
   //          return parsed;
   //       }),
   //    quantity: z.string()
   //       .transform((val) => {
   //          const parsed = parseInt(val);
   //          if (isNaN(parsed)) {
   //             throw new ResponseError(400, "Invalid number");
   //          }
   //          return parsed;
   //       }),
   //    photo: z.string().optional(),
   //    categoryId: z.string()
   //       .transform((val) => {
   //          const parsed = parseInt(val);
   //          if (isNaN(parsed)) {
   //             throw new ResponseError(400, "Invalid number");
   //          }
   //          return parsed;
   //       }),
   // })

   static readonly SEARCH: ZodType = z.object({
      name: z.string().min(1).optional(),
      sku: z.string().min(1).optional(),
      createdAt: z.string().min(1).optional(),
      updatedAt: z.string().min(1).optional(),
      page: z.number().min(1).positive(),
      size: z.number().min(1).max(100).positive()
   })

   // transaction 
   static readonly TRANSACTION: ZodType = z.object({
      productId: z.number().min(1).positive(),
      quantity: z.number().min(1).positive(),
      type: z.string().min(1).max(10),
      destinationId: z.number().min(1)
   })

   static readonly TRANSACTIONUPDATE: ZodType = z.object({
      productId: z.number().min(1).positive(),
      quantity: z.number().min(1).positive(),
      type: z.string().min(1).max(10),
   })

   // user 
   static readonly USER: ZodType = z.object({
      username: z.string().min(3),
      email: z.string().min(5),
      password: z.string().min(7),
      role: z.string(),
   })

   static readonly LOGIN: ZodType = z.object({
      email: z.string().min(5),
      password: z.string().min(7),
   })

   // warehouse 
   static readonly WAREHOUSE: ZodType = z.object({
      name: z.string().min(5),
      address: z.string().min(5),
   })

   // destination 
   static readonly DESTINATION: ZodType = z.object({
      name: z.string().min(1),
      address: z.string().min(5),
   })

   // TransactionDestination 
   static readonly TDESTINATION: ZodType = z.object({
      transactionId: z.number().min(1),
      destinationId: z.number().min(1)
   })
}
