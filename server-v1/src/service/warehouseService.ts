import { prisma } from "../lib/prisma";
import { ResponseError } from "../lib/responseError";
import {
   toWarehouseResponse,
   WarehouseRequest,
   WarehouseResponse,
   WarehouseResponseArray
} from "../model/warehouseModel";
import { Validation } from "../validation/validation";

export class WarehouseService {

   static async create(request: WarehouseRequest): Promise<WarehouseResponse> {
      const warehouseRequest = Validation.validate(Validation.WAREHOUSE, request)

      const warehouse = await prisma.warehouse.create({
         data: warehouseRequest
      })

      return toWarehouseResponse(warehouse);
   }

   static async findAll(): Promise<WarehouseResponseArray<WarehouseResponse>> {
      const warehouses = await prisma.warehouse.findMany()
      return {
         message: 'Success',
         data: warehouses.map(warehouse => toWarehouseResponse(warehouse))
      }
   }

   static async findOne(warehouseId: number): Promise<WarehouseResponse> {
      const warehouse = await prisma.warehouse.findUnique({
         where: { id: warehouseId }
      })

      if (!warehouse) throw new ResponseError(404, 'Warehouse not found')

      return toWarehouseResponse(warehouse);

   }

   static async update(warehouseId: number, request: WarehouseRequest): Promise<WarehouseResponse> {
      const warehouseRequest = Validation.validate(Validation.WAREHOUSE, request)

      await this.findOne(warehouseId)

      const warehouse = await prisma.warehouse.update({
         where: {
            id: warehouseId
         },
         data: warehouseRequest
      })

      return toWarehouseResponse(warehouse);
   }

   static async remove(warehouseId: number): Promise<WarehouseResponse> {
      await this.findOne(warehouseId)

      const warehouse = await prisma.warehouse.delete({
         where: { id: warehouseId }
      })

      return toWarehouseResponse(warehouse);
   }
}
