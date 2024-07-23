"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionValidation = void 0;
const zod_1 = require("zod");
class TransactionValidation {
}
exports.TransactionValidation = TransactionValidation;
TransactionValidation.REQUEST = zod_1.z.object({
    productId: zod_1.z.number().min(1).positive(),
    quantity: zod_1.z.number().min(1).positive(),
    type: zod_1.z.string().min(1).max(10),
    totalPrice: zod_1.z.string().optional()
});
