"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDestinationResponse = toDestinationResponse;
function toDestinationResponse(destination) {
    return {
        id: destination.id,
        name: destination.name,
        address: destination.address,
        createdAt: destination.createdAt,
        updatedAt: destination.updatedAt,
    };
}
