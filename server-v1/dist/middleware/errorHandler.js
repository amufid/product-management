"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const responseError_1 = require("../lib/responseError");
const errorHandler = (error, req, res, next) => {
    if (error instanceof zod_1.ZodError) {
        res.status(400).json({
            errors: `Validation error: ${JSON.stringify(error)}`
        });
    }
    else if (error instanceof responseError_1.ResponseError) {
        res.status(error.status).json({
            errors: error.message
        });
    }
    else {
        res.status(500).json({
            errors: error.message
        });
    }
};
exports.errorHandler = errorHandler;
