import { prisma } from "../lib/prisma";
import { ResponseError } from "../lib/responseError";
import { Pageable } from "../model/pagination";
import {
   ProductRequest,
   ProductResponse,
   SearchProductRequest,
   toProductResponse,
   toProductResponseInclude,
} from "../model/productModel";
import { Validation } from "../validation/validation";

export class ProductsService {

   static async create(request: ProductRequest): Promise<ProductResponse> {
      const createRequest = Validation.validate(Validation.PRODUCT, request)

      const product = await prisma.products.create({
         data: createRequest
      })
      return toProductResponse(product);
   }

   static async findAll(request: SearchProductRequest): Promise<Pageable<ProductResponse>> {
      const searchRequest = Validation.validate(Validation.SEARCH, request)
      const skip = (searchRequest.page - 1) * searchRequest.size
      const filters: any[] = [];
      const filtersTime: any[] = []

      // check name
      if (searchRequest.name) {
         filters.push({
            name: {
               equals: `%${searchRequest.name}%`,
               mode: 'insensitive'
            }
         })
      }
      // check sku
      if (searchRequest.sku) {
         filters.push({
            sku: {
               contains: searchRequest.sku
            }
         })
      }

      if (searchRequest.createdAt) {
         filtersTime.push({
            createdAt: searchRequest.createdAt
         })
      }

      if (searchRequest.updatedAt) {
         filtersTime.push({
            updatedAt: searchRequest.updatedAt
         })
      }

      const products = await prisma.products.findMany({
         where: {
            AND: filters
         },
         include: {
            Transaction: true,
            Inventory: true
         },
         orderBy: filtersTime,
         take: searchRequest.size,
         skip: skip
      })

      const total = await prisma.products.count({
         where: { AND: filters }
      })

      return {
         message: 'Success',
         data: products.map(product => toProductResponseInclude(product)),
         paging: {
            currentPage: searchRequest.page,
            totalPages: Math.ceil(total / searchRequest.size),
            size: searchRequest.size
         }
      }
   }

   static async findOne(productId: number): Promise<ProductResponse> {
      const product = await prisma.products.findUnique({
         where: {
            id: productId
         },
         include: {
            Transaction: true,
            Inventory: true
         }
      })

      if (!product) {
         throw new ResponseError(404, 'Product not found');
      }
      return toProductResponseInclude(product);
   }

   static async update(productId: number, request: ProductRequest): Promise<ProductResponse> {
      const updateRequest = Validation.validate(Validation.PRODUCT, request)

      const checkProduct = await this.findOne(productId)

      const product = await prisma.products.update({
         where: { id: checkProduct.id },
         data: updateRequest
      })

      return toProductResponse(product);
   }

   static async remove(productId: number): Promise<ProductResponse> {
      const checkProduct = await this.findOne(productId)

      const product = await prisma.products.delete({
         where: { id: checkProduct.id }
      })
      return toProductResponse(product);
   }
}
