"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const productsService_1 = require("../service/productsService");
class ProductsController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const cloudinaryUrl = req.body.cloudinaryUrl;
                const response = yield productsService_1.ProductsService.create(cloudinaryUrl, request);
                res.status(201).json({
                    message: 'Success',
                    data: response
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = {
                    name: req.query.name,
                    sku: req.query.sku,
                    createdAt: req.query.createdAt,
                    updatedAt: req.query.updatedAt,
                    page: req.query.page ? Number(req.query.page) : 1,
                    size: req.query.size ? Number(req.query.size) : 5,
                };
                const response = yield productsService_1.ProductsService.findAll(request);
                res.status(200).json(response);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static findOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const productId = Number(id);
                const response = yield productsService_1.ProductsService.findOne(productId);
                res.status(200).json({
                    message: 'Success',
                    data: response
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const { id } = req.params;
                const productId = Number(id);
                const response = yield productsService_1.ProductsService.update(productId, request);
                res.status(200).json({
                    message: 'Success',
                    data: response
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static remove(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const productId = Number(id);
                const response = yield productsService_1.ProductsService.remove(productId);
                res.status(200).json({
                    message: 'Success'
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.ProductsController = ProductsController;
