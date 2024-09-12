"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponse = toUserResponse;
function toUserResponse(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        approved: user.approved,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
