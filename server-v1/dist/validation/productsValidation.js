"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const responseError_1 = require("../lib/responseError");
class ProductValidation {
}
exports.ProductValidation = ProductValidation;
ProductValidation.CREATE = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().min(1).max(255),
    sku: zod_1.z.string().min(1).max(20),
    price: zod_1.z.string()
        .transform((val) => {
        const parsed = parseInt(val);
        if (isNaN(parsed)) {
            throw new responseError_1.ResponseError(400, "Invalid number");
        }
        return parsed;
    }),
    quantity: zod_1.z.string()
        .transform((val) => {
        const parsed = parseInt(val);
        if (isNaN(parsed)) {
            throw new responseError_1.ResponseError(400, "Invalid number");
        }
        return parsed;
    }),
    photo: zod_1.z.string().optional()
});
ProductValidation.UPDATE = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().min(1).max(255),
    sku: zod_1.z.string().min(1).max(20),
    price: zod_1.z.string()
        .transform((val) => {
        const parsed = parseInt(val);
        if (isNaN(parsed)) {
            throw new responseError_1.ResponseError(400, "Invalid number");
        }
        return parsed;
    }),
    quantity: zod_1.z.string()
        .transform((val) => {
        const parsed = parseInt(val);
        if (isNaN(parsed)) {
            throw new responseError_1.ResponseError(400, "Invalid number");
        }
        return parsed;
    }),
    photo: zod_1.z.string().optional()
});
ProductValidation.SEARCH = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    sku: zod_1.z.string().min(1).optional(),
    createdAt: zod_1.z.string().min(1).optional(),
    updatedAt: zod_1.z.string().min(1).optional(),
    page: zod_1.z.number().min(1).positive(),
    size: zod_1.z.number().min(1).max(100).positive()
});
