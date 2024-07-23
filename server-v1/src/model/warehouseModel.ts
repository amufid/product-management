import { Warehouse } from "@prisma/client";

export type WarehouseRequest = {
   name: string;
   address: string;
}

export type WarehouseResponse = {
   id: number;
   name: string;
   address: string;
   createdAt: Date;
   updatedAt: Date;
}

export type WarehouseResponseArray<T> = {
   message: string;
   data: T[];
}

export function toWarehouseResponse(warehouse: Warehouse): WarehouseResponse {
   return {
      id: warehouse.id,
      name: warehouse.name,
      address: warehouse.address,
      createdAt: warehouse.createdAt,
      updatedAt: warehouse.updatedAt,
   }
}
