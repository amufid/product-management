import { prisma } from "../lib/prisma";
import { ResponseError } from "../lib/responseError";
import {
   DestinationRequest,
   DestinationResponse,
   DestinationResponseArray,
   toDestinationResponse
} from "../model/destinationModel";
import { Validation } from "../validation/validation";

export class DestinationService {

   static async create(request: DestinationRequest): Promise<DestinationResponse> {
      const createRequest = Validation.validate(Validation.DESTINATION, request)

      const destination = await prisma.destination.create({
         data: createRequest
      })

      return toDestinationResponse(destination);
   }

   static async findAll(): Promise<DestinationResponseArray<DestinationResponse>> {
      const destinations = await prisma.destination.findMany()
      return {
         message: 'Success',
         data: destinations.map(destination => toDestinationResponse(destination))
      }
   }

   static async findOne(destinationId: number): Promise<DestinationResponse> {
      const destination = await prisma.destination.findUnique({
         where: { id: destinationId }
      })

      if (!destination) throw new ResponseError(404, 'Destination not found')

      return toDestinationResponse(destination);
   }

   static async update(destinationId: number, request: DestinationRequest): Promise<DestinationResponse> {
      const updateRequest = Validation.validate(Validation.DESTINATION, request)

      await this.findOne(destinationId)

      const destination = await prisma.destination.update({
         where: {
            id: destinationId
         },
         data: updateRequest
      })

      return toDestinationResponse(destination)
   }

   static async remove(destinationId: number): Promise<DestinationResponse> {
      await this.findOne(destinationId)

      const destination = await prisma.destination.delete({
         where: { id: destinationId }
      })

      return toDestinationResponse(destination);
   }
}
