import { prisma } from "../lib/prisma";
import { ResponseError } from "../lib/responseError";
import {
   CategoryRequest,
   CategoryResponse,
   CategoryResponseArray,
   CategoryResponseData,
   CategoryWithProductResponse,
   toCategoryResponse,
   toCategoryResponseArray,
   toCategoryResponseData,
} from "../model/categoryModel";
import { Validation } from "../validation/validation";

export class CategoryService {

   static async create(request: CategoryRequest): Promise<CategoryResponseData> {
      const createRequest = Validation.validate(Validation.CATEGORY, request)

      const category = await prisma.categories.create({
         data: createRequest
      })
      return toCategoryResponseData(category);
   }

   static async findAll(): Promise<CategoryResponseArray<CategoryWithProductResponse>> {
      const categories = await prisma.categories.findMany({
         include: {
            Products: true
         }
      })
      return {
         message: 'Success',
         data: toCategoryResponseArray(categories)
      }
   }

   static async findOne(categoryId: number): Promise<CategoryResponse> {
      const category = await prisma.categories.findUnique({
         where: {
            id: categoryId
         },
         include: {
            Products: true
         }
      })

      if (!category) {
         throw new ResponseError(404, 'Category not found')
      }
      return toCategoryResponse(category)
   }

   static async update(categoryId: number, request: CategoryRequest): Promise<CategoryResponseData> {
      const updateRequest = Validation.validate(Validation.CATEGORY, request)

      const findCategory = await this.findOne(categoryId)

      const category = await prisma.categories.update({
         where: {
            id: findCategory.id
         },
         data: updateRequest
      })
      return toCategoryResponseData(category)
   }

   static async remove(categoryId: number): Promise<CategoryResponseData> {
      const findCategory = await this.findOne(categoryId)

      const result = await prisma.categories.delete({
         where: { id: findCategory.id }
      })
      return toCategoryResponseData(result);
   }
}
