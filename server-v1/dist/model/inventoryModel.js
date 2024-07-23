"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toInventoryResponse = toInventoryResponse;
function toInventoryResponse(inventory) {
    return {
        id: inventory.id,
        productId: inventory.productId,
        locationId: inventory.locationId,
        quantity: inventory.quantity,
        createdAt: inventory.createdAt,
        updatedAt: inventory.updatedAt,
    };
}
