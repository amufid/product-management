"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseValidation = void 0;
const zod_1 = require("zod");
class WarehouseValidation {
}
exports.WarehouseValidation = WarehouseValidation;
WarehouseValidation.REQUEST = zod_1.z.object({
    name: zod_1.z.string().min(5),
    address: zod_1.z.string().min(5),
});
