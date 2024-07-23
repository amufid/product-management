"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toWarehouseResponse = toWarehouseResponse;
function toWarehouseResponse(warehouse) {
    return {
        id: warehouse.id,
        name: warehouse.name,
        address: warehouse.address,
        createdAt: warehouse.createdAt,
        updatedAt: warehouse.updatedAt,
    };
}
