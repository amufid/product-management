import { Type as TransactionType } from "@prisma/client";
import { ProductResponse } from "./productModel";
import { DestinationResponse } from "./destinationModel";

export type TransactionResponse = {
   id: number;
   productId: number;
   quantity: number;
   type: TransactionType;
   totalPrice: number;
   createdAt: Date;
   updatedAt: Date;
}

export type TransactionDestinationResponse = {
   id: number;
   transactionId: number;
   destinationId: number;
   createdAt: Date;
   updatedAt: Date;
}

type TransactionArrayElement = TransactionResponse | ProductResponse | TransactionDestinationResponse

export type TransactionResponseData = TransactionArrayElement[];

export type TransactionRequest = {
   productId: number;
   quantity: number;
   type: TransactionType;
   totalPrice: number;
   transactionId: number;
   destinationId: number;
}

export type TransactionResponseArray<T> = {
   message: string;
   data: T[]
}

export function toTransactionResponse(transaction: Transaction): TransactionResponse {
   return {
      id: transaction.id,
      productId: transaction.productId,
      quantity: transaction.quantity,
      type: transaction.type,
      totalPrice: transaction.totalPrice,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
   }
}

type TransactionDestination = {
   id: number;
   transactionId: number;
   destinationId: number;
   createdAt: Date;
   updatedAt: Date;
   destination: DestinationResponse;
};

type Transaction = {
   id: number;
   productId: number;
   quantity: number;
   type: TransactionType;
   totalPrice: number;
   createdAt: Date;
   updatedAt: Date;
   TransactionDestination: TransactionDestination[];
};

type TransactionIncludeDestination = {
   id: number;
   productId: number;
   quantity: number;
   type: TransactionType;
   totalPrice: number;
   createdAt: Date;
   updatedAt: Date;
   TransactionDestination: {
      id: number;
      transactionId: number;
      destinationId: number;
      createdAt: Date;
      updatedAt: Date;
      destination: {
         id: number;
         name: string;
         address: string;
         createdAt: Date;
         updatedAt: Date;
      };
   }[];
};

export function toTransactionIncludeDestinationResponse(transaction: Transaction): TransactionIncludeDestination {
   return {
      id: transaction.id,
      productId: transaction.productId,
      quantity: transaction.quantity,
      type: transaction.type,
      totalPrice: transaction.totalPrice,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      TransactionDestination: transaction.TransactionDestination.map(td => ({
         id: td.id,
         transactionId: td.transactionId,
         destinationId: td.destinationId,
         createdAt: td.createdAt,
         updatedAt: td.updatedAt,
         destination: {
            id: td.destination.id,
            name: td.destination.name,
            address: td.destination.address,
            createdAt: td.destination.createdAt,
            updatedAt: td.destination.updatedAt,
         }
      }))
   }
}
