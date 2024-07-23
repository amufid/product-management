import { Categories, Products } from "@prisma/client";

export type CategoryRequest = {
   name: string;
}

// response category create and update 
export type CategoryResponseData = {
   id: number;
   name: string;
   createdAt: Date;
   updatedAt: Date;
};

export const toCategoryResponseData = (category: Categories): CategoryResponseData => {
   return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
   };
};

// response category include products 
type ProductResponse = {
   id: number;
   name: string;
   description?: string | null;
   sku: string;
   price: number;
   quantity: number;
   photo?: string | null;
   categoryId: number;
   createdAt: Date;
   updatedAt: Date;
}

export type CategoryResponse = {
   id: number;
   name: string;
   createdAt: Date;
   updatedAt: Date;
   Products: ProductResponse[];
};

export const toCategoryResponse = (category: (Categories & { Products: Products[] })): CategoryResponse => {
   return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      Products: category.Products.map(product => ({
         id: product.id,
         name: product.name,
         description: product.description,
         sku: product.sku,
         price: product.price,
         photo: product.photo,
         quantity: product.quantity,
         categoryId: product.categoryId,
         createdAt: product.createdAt,
         updatedAt: product.updatedAt,
      })),
   };
};

// response categories array include products 
export type CategoryWithProductResponse = {
   id: number;
   name: string;
   createdAt: Date;
   updatedAt: Date;
   Products: ProductResponse[];
};

export type CategoryResponseArray<T> = {
   message: string;
   data: T[];
};

export const toCategoryResponseArray = (categories:
   (Categories & { Products: Products[] })[]): CategoryWithProductResponse[] => {
   return categories.map(category => ({
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      Products: category.Products.map(product => ({
         id: product.id,
         name: product.name,
         description: product.description,
         sku: product.sku,
         price: product.price,
         photo: product.photo,
         quantity: product.quantity,
         categoryId: product.categoryId,
         createdAt: product.createdAt,
         updatedAt: product.updatedAt,
      })),
   }))
};
