"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryValidation = void 0;
const zod_1 = require("zod");
class InventoryValidation {
}
exports.InventoryValidation = InventoryValidation;
InventoryValidation.CREATE = zod_1.z.object({
    productId: zod_1.z.number().min(1),
    locationId: zod_1.z.number().min(1),
    quantity: zod_1.z.number().min(1),
});
