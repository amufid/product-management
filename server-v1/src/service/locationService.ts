import { prisma } from "../lib/prisma";
import { ResponseError } from "../lib/responseError";
import {
   LocationRequest,
   LocationResponse,
   LocationResponseArray,
   toLocationResponse,
} from "../model/locationModel";
import { Validation } from "../validation/validation";

export class LocationService {

   static async create(request: LocationRequest): Promise<LocationResponse> {
      const createRequest = Validation.validate(Validation.LOCATION, request)

      const location = await prisma.location.create({
         data: createRequest
      })

      return toLocationResponse(location);
   }

   static async findAll(): Promise<LocationResponseArray<LocationResponse>> {
      const locations = await prisma.location.findMany()
      return {
         message: 'Success',
         data: locations.map(location => toLocationResponse(location))
      }
   }

   static async findOne(locationId: number): Promise<LocationResponse> {
      const location = await prisma.location.findUnique({
         where: { id: locationId }
      })

      if (!location) {
         throw new ResponseError(404, 'Location not found')
      }

      return toLocationResponse(location)
   }

   static async update(locationId: number, request: LocationRequest): Promise<LocationResponse> {
      const updateRequest = Validation.validate(Validation.LOCATION, request)

      const findLocation = await this.findOne(locationId)

      const location = await prisma.location.update({
         where: {
            id: findLocation.id
         },
         data: updateRequest
      })

      return toLocationResponse(location)
   }

   static async remove(locationId: number): Promise<LocationResponse> {
      const findLocation = await this.findOne(locationId)

      const location = await prisma.location.delete({
         where: { id: findLocation.id }
      })

      return toLocationResponse(location)
   }
}
