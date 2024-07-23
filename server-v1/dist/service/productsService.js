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
exports.ProductsService = void 0;
const prisma_1 = require("../lib/prisma");
const responseError_1 = require("../lib/responseError");
const productsModel_1 = require("../model/productsModel");
const productsValidation_1 = require("../validation/productsValidation");
const validation_1 = require("../validation/validation");
class ProductsService {
    static create(cloudinaryUrl, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(productsValidation_1.ProductValidation.CREATE, request);
            const setData = Object.assign(Object.assign({}, createRequest), { photo: cloudinaryUrl });
            const product = yield prisma_1.prisma.products.create({
                data: setData
            });
            return (0, productsModel_1.toProductResponse)(product);
        });
    }
    static findAll(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(productsValidation_1.ProductValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            const filtersTime = [];
            // check name
            if (searchRequest.name) {
                filters.push({
                    name: {
                        equals: `%${searchRequest.name}%`,
                        mode: 'insensitive'
                    }
                });
            }
            // check sku
            if (searchRequest.sku) {
                filters.push({
                    sku: {
                        contains: searchRequest.sku
                    }
                });
            }
            if (searchRequest.createdAt) {
                filtersTime.push({
                    createdAt: searchRequest.createdAt
                });
            }
            if (searchRequest.updatedAt) {
                filtersTime.push({
                    updatedAt: searchRequest.updatedAt
                });
            }
            console.log(filtersTime, '<<<<<<');
            const products = yield prisma_1.prisma.products.findMany({
                where: {
                    AND: filters
                },
                orderBy: filtersTime,
                take: searchRequest.size,
                skip: skip
            });
            const total = yield prisma_1.prisma.products.count({
                where: { AND: filters }
            });
            return {
                data: products.map(product => (0, productsModel_1.toProductResponse)(product)),
                paging: {
                    currentPage: searchRequest.page,
                    totalPages: Math.ceil(total / searchRequest.size),
                    size: searchRequest.size
                }
            };
        });
    }
    static findOne(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield prisma_1.prisma.products.findUnique({
                where: { id: productId }
            });
            if (!product) {
                throw new responseError_1.ResponseError(404, 'Product not found');
            }
            return (0, productsModel_1.toProductResponse)(product);
        });
    }
    static update(productId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(productsValidation_1.ProductValidation.UPDATE, request);
            const checkProduct = yield this.findOne(productId);
            const product = yield prisma_1.prisma.products.update({
                where: { id: checkProduct.id },
                data: updateRequest
            });
            return (0, productsModel_1.toProductResponse)(product);
        });
    }
    static remove(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkProduct = yield this.findOne(productId);
            const product = yield prisma_1.prisma.products.delete({
                where: { id: checkProduct.id }
            });
            return (0, productsModel_1.toProductResponse)(product);
        });
    }
}
exports.ProductsService = ProductsService;
