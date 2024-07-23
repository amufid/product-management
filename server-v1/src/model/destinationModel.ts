import { Destination } from "@prisma/client";

export type DestinationResponse = {
   id: number;
   name: string;
   address: string;
   createdAt: Date;
   updatedAt: Date;
}

export type DestinationRequest = {
   name: string;
   address: string;
}

export type DestinationResponseArray<T> = {
   message: string;
   data: T[];
}

export function toDestinationResponse(destination: Destination): DestinationResponse {
   return {
      id: destination.id,
      name: destination.name,
      address: destination.address,
      createdAt: destination.createdAt,
      updatedAt: destination.updatedAt,
   }
}
