import { Location } from "@prisma/client";

export interface LocationResponse {
   id: number;
   code: string;
   description: string;
   createdAt: Date;
   updatedAt: Date;
}

export interface LocationRequest {
   code: string;
   description: string;
}

export interface LocationResponseArray<T> {
   message: string;
   data: T[];
}

export function toLocationResponse(location: Location): LocationResponse {
   return {
      id: location.id,
      code: location.code,
      description: location.description,
      createdAt: location.createdAt,
      updatedAt: location.updatedAt
   }
}
