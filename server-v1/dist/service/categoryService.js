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
exports.CategoryService = void 0;
const prisma_1 = require("../lib/prisma");
const responseError_1 = require("../lib/responseError");
const categoryModel_1 = require("../model/categoryModel");
const validation_1 = require("../validation/validation");
class CategoryService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(validation_1.Validation.CATEGORY, request);
            const category = yield prisma_1.prisma.categories.create({
                data: createRequest
            });
            return (0, categoryModel_1.toCategoryResponseData)(category);
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield prisma_1.prisma.categories.findMany({
                include: {
                    Products: true
                }
            });
            return {
                message: 'Success',
                data: (0, categoryModel_1.toCategoryResponseArray)(categories)
            };
        });
    }
    static findOne(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield prisma_1.prisma.categories.findUnique({
                where: {
                    id: categoryId
                },
                include: {
                    Products: true
                }
            });
            if (!category) {
                throw new responseError_1.ResponseError(404, 'Category not found');
            }
            return (0, categoryModel_1.toCategoryResponse)(category);
        });
    }
    static update(categoryId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(validation_1.Validation.CATEGORY, request);
            const findCategory = yield this.findOne(categoryId);
            const category = yield prisma_1.prisma.categories.update({
                where: {
                    id: findCategory.id
                },
                data: updateRequest
            });
            return (0, categoryModel_1.toCategoryResponseData)(category);
        });
    }
    static remove(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const findCategory = yield this.findOne(categoryId);
            const result = yield prisma_1.prisma.categories.delete({
                where: { id: findCategory.id }
            });
            return (0, categoryModel_1.toCategoryResponseData)(result);
        });
    }
}
exports.CategoryService = CategoryService;
