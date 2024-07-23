"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationValidation = void 0;
const zod_1 = require("zod");
class LocationValidation {
}
exports.LocationValidation = LocationValidation;
LocationValidation.CREATE = zod_1.z.object({
    code: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
});
LocationValidation.UPDATE = zod_1.z.object({
    code: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
});
