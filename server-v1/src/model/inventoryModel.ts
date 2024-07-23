import { Inventory } from "@prisma/client";

export type InventoryResponse = {
   id: number;
   productId: number;
   locationId: number;
   quantity: number;
   createdAt: Date;
   updatedAt: Date;
}

export type InventoryRequest = {
   productId: number;
   locationId: number;
   quantity: number;
}

export type InventoryResponseArray<T> = {
   message: 'Success';
   data: T[];
}

export function toInventoryResponse(inventory: Inventory): InventoryResponse {
   return {
      id: inventory.id,
      productId: inventory.productId,
      locationId: inventory.locationId,
      quantity: inventory.quantity,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
   }
}
