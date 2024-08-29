import { prisma } from "../lib/prisma";
import { ResponseError } from "../lib/responseError";
import { ProductResponse } from "../model/productModel";
import {
   toTransactionIncludeDestinationResponse,
   TransactionDestinationResponse,
   TransactionRequest,
   TransactionResponse,
   TransactionResponseArray,
   TransactionResponseData,
} from "../model/transactionModel";
import { Validation } from "../validation/validation";

export class TransactionService {

   static async create(request: TransactionRequest): Promise<TransactionResponseData> {
      const createRequest = Validation.validate(Validation.TRANSACTION, request)

      const findProduct = await prisma.products.findUnique({
         where: {
            id: createRequest.productId
         }
      })

      if (!findProduct) {
         throw new ResponseError(404, 'Product not found')
      }

      let productQuantity: number = 0;

      if (createRequest.type === 'IN') {

         productQuantity = findProduct.quantity + createRequest.quantity;

      } else if (createRequest.type === 'OUT') {

         productQuantity = findProduct.quantity - createRequest.quantity;
      }

      const productTotalPrice: number = findProduct.price * createRequest.quantity;

      const result = await prisma.$transaction(async (tx) => {
         const transaction = await tx.transaction.create({
            data: {
               productId: createRequest.productId,
               quantity: createRequest.quantity,
               type: createRequest.type,
               totalPrice: productTotalPrice
            }
         })

         const product = await tx.products.update({
            where: {
               id: createRequest.productId
            },
            data: {
               quantity: productQuantity
            }
         })

         const transactionDestination = await tx.transactionDestination.create({
            data: {
               transactionId: transaction.id,
               destinationId: createRequest.destinationId
            }
         })

         return { transaction, product, transactionDestination }
      })

      return [
         {
            id: result.transaction.id,
            productId: result.transaction.productId,
            quantity: result.transaction.quantity,
            type: result.transaction.type,
            totalPrice: result.transaction.totalPrice,
         } as TransactionResponse,
         {
            id: result.product.id,
            quantity: result.product.quantity,
         } as ProductResponse,
         {
            id: result.transactionDestination.id,
            transactionId: result.transactionDestination.transactionId,
            destinationId: result.transactionDestination.destinationId,
         } as TransactionDestinationResponse,
      ]
   }

   static async findAll(): Promise<TransactionResponseArray<TransactionResponse>> {
      const transactions = await prisma.transaction.findMany({
         include: {
            TransactionDestination: {
               include: {
                  destination: true
               }
            }
         },
         orderBy: {
            createdAt: 'desc'
         }
      })

      return {
         message: 'Success',
         data: transactions.map(transaction => toTransactionIncludeDestinationResponse(transaction))
      }
   }

   static async findOne(transactionId: number): Promise<TransactionResponse> {
      const transaction = await prisma.transaction.findUnique({
         where: {
            id: transactionId
         },
         include: {
            TransactionDestination: {
               include: {
                  destination: true
               }
            }
         }
      })

      if (!transaction) {
         throw new ResponseError(404, 'Transaction not found')
      }

      return toTransactionIncludeDestinationResponse(transaction);
   }

   static async update(transactionId: number, request: TransactionRequest): Promise<TransactionResponseData> {
      const updateRequest = Validation.validate(Validation.TRANSACTIONUPDATE, request)

      const findTransaction = await this.findOne(transactionId)

      const findProduct = await prisma.products.findUnique({
         where: {
            id: findTransaction.productId
         }
      })

      if (!findProduct) {
         throw new ResponseError(404, 'Product not found')
      }

      let productQuantity: number = 0;

      if (findTransaction.quantity <= updateRequest.quantity) {

         // jika quantity baru lebih besar 
         let newQuantity = updateRequest.quantity - findTransaction.quantity

         if (updateRequest.type === 'OUT') {

            productQuantity = findProduct.quantity - newQuantity

         } else if (updateRequest.type === 'IN') {

            productQuantity = findProduct.quantity + newQuantity
         }

      } else if (findTransaction.quantity >= updateRequest.quantity) {

         // jika quantity baru lebih kecil
         let newQuantity = findTransaction.quantity - updateRequest.quantity

         if (updateRequest.type === 'OUT') {

            productQuantity = findProduct.quantity + newQuantity

         } else if (updateRequest.type === 'IN') {

            productQuantity = findProduct.quantity - newQuantity
         }
      }

      const productTotalPrice: number = findProduct.price * updateRequest.quantity;

      const setData = {
         ...updateRequest,
         ...{ totalPrice: productTotalPrice }
      }

      const transaction = await prisma.$transaction([
         prisma.transaction.update({
            where: {
               id: findTransaction.id
            },
            data: setData
         }),
         prisma.products.update({
            where: {
               id: updateRequest.productId
            },
            data: {
               quantity: productQuantity
            }
         })
      ]);

      return transaction;
   }

}
