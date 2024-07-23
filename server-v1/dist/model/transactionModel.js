"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTransactionResponse = toTransactionResponse;
exports.toTransactionIncludeDestinationResponse = toTransactionIncludeDestinationResponse;
function toTransactionResponse(transaction) {
    return {
        id: transaction.id,
        productId: transaction.productId,
        quantity: transaction.quantity,
        type: transaction.type,
        totalPrice: transaction.totalPrice,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
    };
}
function toTransactionIncludeDestinationResponse(transaction) {
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
    };
}
