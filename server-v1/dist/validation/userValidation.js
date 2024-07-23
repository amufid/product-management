"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
class UserValidation {
}
exports.UserValidation = UserValidation;
UserValidation.REGISTER = zod_1.z.object({
    username: zod_1.z.string().min(3),
    email: zod_1.z.string().min(5),
    password: zod_1.z.string().min(7),
    role: zod_1.z.string(),
});
UserValidation.LOGIN = zod_1.z.object({
    email: zod_1.z.string().min(5),
    password: zod_1.z.string().min(7),
});
UserValidation.UPDATE = zod_1.z.object({
    username: zod_1.z.string().min(3),
    email: zod_1.z.string().min(5),
    password: zod_1.z.string().min(7),
    role: zod_1.z.string(),
});
