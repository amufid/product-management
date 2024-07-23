"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toProductResponse = toProductResponse;
exports.toProductResponseInclude = toProductResponseInclude;
function toProductResponse(product) {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        sku: product.sku,
        price: product.price,
        quantity: product.quantity,
        photo: product.photo,
        categoryId: product.categoryId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
}
// export function toProductResponseInclude(product: Products): ProductResponse {
//    return {
//       id: product.id,
//       name: product.name,
//       description: product.description,
//       sku: product.sku,
//       price: product.price,
//       quantity: product.quantity,
//       photo: product.photo,
//       categoryId: product.categoryId,
//       createdAt: product.createdAt,
//       updatedAt: product.updatedAt,
//    }
// }
function toProductResponseInclude(product) {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        sku: product.sku,
        price: product.price,
        quantity: product.quantity,
        photo: product.photo,
        categoryId: product.categoryId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        Transaction: product.Transaction.map(transaction => ({
            id: transaction.id,
            productId: transaction.productId,
            quantity: transaction.quantity,
            type: transaction.type,
            totalPrice: transaction.totalPrice,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        })),
        Inventory: product.Inventory.map(inventory => ({
            id: inventory.id,
            productId: inventory.productId,
            locationId: inventory.locationId,
            quantity: inventory.quantity,
            createdAt: inventory.createdAt,
            updatedAt: inventory.updatedAt,
        }))
    };
}
