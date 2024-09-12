"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validation = void 0;
const zod_1 = require("zod");
class Validation {
    static validate(schema, data) {
        return schema.parse(data);
    }
}
exports.Validation = Validation;
// category 
Validation.CATEGORY = zod_1.z.object({
    name: zod_1.z.string().min(1)
});
// inventory 
Validation.INVENTORY = zod_1.z.object({
    productId: zod_1.z.number().min(1),
    locationId: zod_1.z.number().min(1),
    quantity: zod_1.z.number().min(1),
});
// location 
Validation.LOCATION = zod_1.z.object({
    code: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
});
// product 
Validation.PRODUCT = zod_1.z.object({
    name: zod_1.z.string().min(1),
    price: zod_1.z.number().min(1),
    sku: zod_1.z.string().min(1).max(20),
    description: zod_1.z.string().optional(),
    quantity: zod_1.z.number(),
    photo: zod_1.z.string().optional(),
    categoryId: zod_1.z.number().min(1),
});
// static readonly PRODUCT: ZodType = z.object({
//    name: z.string().min(1),
//    description: z.string().optional(),
//    sku: z.string().min(1).max(20),
//    price: z.string()
//       .transform((val) => {
//          const parsed = parseInt(val);
//          if (isNaN(parsed)) {
//             throw new ResponseError(400, "Invalid number");
//          }
//          return parsed;
//       }),
//    quantity: z.string()
//       .transform((val) => {
//          const parsed = parseInt(val);
//          if (isNaN(parsed)) {
//             throw new ResponseError(400, "Invalid number");
//          }
//          return parsed;
//       }),
//    photo: z.string().optional(),
//    categoryId: z.string()
//       .transform((val) => {
//          const parsed = parseInt(val);
//          if (isNaN(parsed)) {
//             throw new ResponseError(400, "Invalid number");
//          }
//          return parsed;
//       }),
// })
Validation.SEARCH = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    sku: zod_1.z.string().min(1).optional(),
    createdAt: zod_1.z.string().min(1).optional(),
    updatedAt: zod_1.z.string().min(1).optional(),
    page: zod_1.z.number().min(1).positive(),
    size: zod_1.z.number().min(1).max(100).positive()
});
// transaction 
Validation.TRANSACTION = zod_1.z.object({
    productId: zod_1.z.number().min(1).positive(),
    quantity: zod_1.z.number().min(1).positive(),
    type: zod_1.z.string().min(1).max(10),
    destinationId: zod_1.z.number().min(1)
});
Validation.TRANSACTIONUPDATE = zod_1.z.object({
    productId: zod_1.z.number().min(1).positive(),
    quantity: zod_1.z.number().min(1).positive(),
    type: zod_1.z.string().min(1).max(10),
});
// user 
Validation.USER = zod_1.z.object({
    username: zod_1.z.string().min(3),
    email: zod_1.z.string().min(5),
    password: zod_1.z.string().min(7),
    role: zod_1.z.string(),
});
Validation.UserUpdate = zod_1.z.object({
    username: zod_1.z.string().min(3),
    email: zod_1.z.string().min(5),
    // password: z.string().min(7),
    // role: z.string(),
});
Validation.UserApprove = zod_1.z.object({
    approved: zod_1.z.boolean(),
});
Validation.LOGIN = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string(),
});
// warehouse 
Validation.WAREHOUSE = zod_1.z.object({
    name: zod_1.z.string().min(5),
    address: zod_1.z.string().min(5),
});
// destination 
Validation.DESTINATION = zod_1.z.object({
    name: zod_1.z.string().min(1),
    address: zod_1.z.string().min(5),
});
// TransactionDestination 
Validation.TDESTINATION = zod_1.z.object({
    transactionId: zod_1.z.number().min(1),
    destinationId: zod_1.z.number().min(1)
});
