"use strict";
// import { prisma } from "../lib/prisma";
// import {
//    CreateProductMovementRequest,
//    ProductMovementResponse,
//    toProductMovementResponse
// } from "../model/productMovementModel";
// import { ProductMovementValidation } from "../validation/productMovementValidation";
// import { Validation } from "../validation/validation";
// export class ProductMovementService {
//    static async create(request: CreateProductMovementRequest): Promise<ProductMovementResponse> {
//       const createRequest = Validation.validate(ProductMovementValidation.CREATE, request)
//       const productMovement = await prisma.productMovement.create({
//          data: createRequest
//       })
//       return toProductMovementResponse(productMovement);
//    }
// }
