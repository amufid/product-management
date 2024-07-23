"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const prisma_1 = require("../lib/prisma");
const responseError_1 = require("../lib/responseError");
const transactionModel_1 = require("../model/transactionModel");
const validation_1 = require("../validation/validation");
class TransactionService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(validation_1.Validation.TRANSACTION, request);
            const findProduct = yield prisma_1.prisma.products.findUnique({
                where: {
                    id: createRequest.productId
                }
            });
            if (!findProduct) {
                throw new responseError_1.ResponseError(404, 'Product not found');
            }
            let productQuantity = 0;
            if (createRequest.type === 'IN') {
                productQuantity = findProduct.quantity + createRequest.quantity;
            }
            else if (createRequest.type === 'OUT') {
                productQuantity = findProduct.quantity - createRequest.quantity;
            }
            const productTotalPrice = findProduct.price * createRequest.quantity;
            const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const transaction = yield tx.transaction.create({
                    data: {
                        productId: createRequest.productId,
                        quantity: createRequest.quantity,
                        type: createRequest.type,
                        totalPrice: productTotalPrice
                    }
                });
                const product = yield tx.products.update({
                    where: {
                        id: createRequest.productId
                    },
                    data: {
                        quantity: productQuantity
                    }
                });
                const transactionDestination = yield tx.transactionDestination.create({
                    data: {
                        transactionId: transaction.id,
                        destinationId: createRequest.destinationId
                    }
                });
                return { transaction, product, transactionDestination };
            }));
            return [
                {
                    id: result.transaction.id,
                    productId: result.transaction.productId,
                    quantity: result.transaction.quantity,
                    type: result.transaction.type,
                    totalPrice: result.transaction.totalPrice,
                },
                {
                    id: result.product.id,
                    quantity: result.product.quantity,
                },
                {
                    id: result.transactionDestination.id,
                    transactionId: result.transactionDestination.transactionId,
                    destinationId: result.transactionDestination.destinationId,
                },
            ];
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield prisma_1.prisma.transaction.findMany({
                include: {
                    TransactionDestination: {
                        include: {
                            destination: true
                        }
                    }
                }
            });
            return {
                message: 'Success',
                data: transactions.map(transaction => (0, transactionModel_1.toTransactionIncludeDestinationResponse)(transaction))
            };
        });
    }
    static findOne(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield prisma_1.prisma.transaction.findUnique({
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
            });
            if (!transaction) {
                throw new responseError_1.ResponseError(404, 'Transaction not found');
            }
            return (0, transactionModel_1.toTransactionIncludeDestinationResponse)(transaction);
        });
    }
    static update(transactionId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(validation_1.Validation.TRANSACTIONUPDATE, request);
            const findTransaction = yield this.findOne(transactionId);
            const findProduct = yield prisma_1.prisma.products.findUnique({
                where: {
                    id: findTransaction.productId
                }
            });
            if (!findProduct) {
                throw new responseError_1.ResponseError(404, 'Product not found');
            }
            let productQuantity = 0;
            if (findTransaction.quantity <= updateRequest.quantity) {
                // jika quantity baru lebih besar 
                let newQuantity = updateRequest.quantity - findTransaction.quantity;
                if (updateRequest.type === 'OUT') {
                    productQuantity = findProduct.quantity - newQuantity;
                }
                else if (updateRequest.type === 'IN') {
                    productQuantity = findProduct.quantity + newQuantity;
                }
            }
            else if (findTransaction.quantity >= updateRequest.quantity) {
                // jika quantity baru lebih kecil
                let newQuantity = findTransaction.quantity - updateRequest.quantity;
                if (updateRequest.type === 'OUT') {
                    productQuantity = findProduct.quantity + newQuantity;
                }
                else if (updateRequest.type === 'IN') {
                    productQuantity = findProduct.quantity - newQuantity;
                }
            }
            const productTotalPrice = findProduct.price * updateRequest.quantity;
            const setData = Object.assign(Object.assign({}, updateRequest), { totalPrice: productTotalPrice });
            const transaction = yield prisma_1.prisma.$transaction([
                prisma_1.prisma.transaction.update({
                    where: {
                        id: findTransaction.id
                    },
                    data: setData
                }),
                prisma_1.prisma.products.update({
                    where: {
                        id: updateRequest.productId
                    },
                    data: {
                        quantity: productQuantity
                    }
                })
            ]);
            return transaction;
        });
    }
}
exports.TransactionService = TransactionService;
