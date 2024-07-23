import { prisma } from "../lib/prisma";
import { ResponseError } from "../lib/responseError";
import {
   InventoryRequest,
   InventoryResponse,
   InventoryResponseArray,
   toInventoryResponse,
} from "../model/inventoryModel";
import { Validation } from "../validation/validation";

export class InventoryService {

   static async create(request: InventoryRequest): Promise<InventoryResponse> {
      const createRequest = Validation.validate(Validation.INVENTORY, request)

      const inventory = await prisma.inventory.create({
         data: createRequest
      })

      return toInventoryResponse(inventory);
   }

   static async findAll(): Promise<InventoryResponseArray<InventoryResponse>> {
      const inventories = await prisma.inventory.findMany()
      return {
         message: 'Success',
         data: inventories.map(inventory => toInventoryResponse(inventory))
      }
   }

   static async findOne(inventoryId: number): Promise<InventoryResponse> {
      const inventory = await prisma.inventory.findUnique({
         where: { id: inventoryId }
      })

      if (!inventory) {
         throw new ResponseError(404, 'Inventory not found')
      }

      return toInventoryResponse(inventory);
   }

   static async update(inventoryId: number, request: InventoryRequest): Promise<InventoryResponse> {
      const updateRequest = Validation.validate(Validation.INVENTORY, request)

      await this.findOne(inventoryId)

      const inventory = await prisma.inventory.update({
         where: {
            id: inventoryId
         },
         data: updateRequest
      })

      return toInventoryResponse(inventory);
   }

   static async remove(inventoryId: number): Promise<InventoryResponse> {
      await this.findOne(inventoryId)

      const inventory = await prisma.inventory.delete({
         where: { id: inventoryId }
      })

      return toInventoryResponse(inventory);
   }
}
