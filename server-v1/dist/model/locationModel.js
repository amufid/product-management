"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLocationResponse = toLocationResponse;
function toLocationResponse(location) {
    return {
        id: location.id,
        code: location.code,
        description: location.description,
        createdAt: location.createdAt,
        updatedAt: location.updatedAt
    };
}
