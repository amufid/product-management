import { Inventory, Products, Transaction } from "@prisma/client";
import { TransactionResponse } from "./transactionModel";
import { InventoryResponse } from "./inventoryModel";

export type ProductResponse = {
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

export type ProductRequest = {
   name: string;
   description: string;
   sku: string;
   price: number;
   quantity: number;
   photo?: string;
   categoryId: number;
}

export type SearchProductRequest = {
   name?: string;
   sku?: string;
   createdAt?: string;
   updatedAt?: string;
   page: number;
   size: number;
}

export function toProductResponse(product: Products): ProductResponse {
   return {
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      price: product.price,
      quantity: product.quantity,
      photo: product.photo,
      categoryId: product.categoryId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
   }
}

// product include inventory, transaction 

export type ProductResponseInclude = {
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
   Transaction: TransactionResponse[];
   Inventory: InventoryResponse[];
}

// export function toProductResponseInclude(product: Products): ProductResponse {
//    return {
//       id: product.id,
//       name: product.name,
//       description: product.description,
//       sku: product.sku,
//       price: product.price,
//       quantity: product.quantity,
//       photo: product.photo,
//       categoryId: product.categoryId,
//       createdAt: product.createdAt,
//       updatedAt: product.updatedAt,
//    }
// }

export function toProductResponseInclude(product: (Products & { Transaction: Transaction[] } & { Inventory: Inventory[] })): ProductResponseInclude {
   return {
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      price: product.price,
      quantity: product.quantity,
      photo: product.photo,
      categoryId: product.categoryId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      Transaction: product.Transaction.map(transaction => ({
         id: transaction.id,
         productId: transaction.productId,
         quantity: transaction.quantity,
         type: transaction.type,
         totalPrice: transaction.totalPrice,
         createdAt: transaction.createdAt,
         updatedAt: transaction.updatedAt,
      })),
      Inventory: product.Inventory.map(inventory => ({
         id: inventory.id,
         productId: inventory.productId,
         locationId: inventory.locationId,
         quantity: inventory.quantity,
         createdAt: inventory.createdAt,
         updatedAt: inventory.updatedAt,
      }))
   }
}
