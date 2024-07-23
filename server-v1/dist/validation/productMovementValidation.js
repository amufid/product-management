"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductMovementValidation = void 0;
const zod_1 = require("zod");
class ProductMovementValidation {
}
exports.ProductMovementValidation = ProductMovementValidation;
ProductMovementValidation.CREATE = zod_1.z.object({
    productId: zod_1.z.number().min(1),
    quantity: zod_1.z.number().min(1),
});
ProductMovementValidation.UPDATE = zod_1.z.object({
    productId: zod_1.z.number().min(1),
    quantity: zod_1.z.number().min(1),
});
