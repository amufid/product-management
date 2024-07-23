"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCategoryResponseArray = exports.toCategoryResponse = exports.toCategoryResponseData = void 0;
const toCategoryResponseData = (category) => {
    return {
        id: category.id,
        name: category.name,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
    };
};
exports.toCategoryResponseData = toCategoryResponseData;
const toCategoryResponse = (category) => {
    return {
        id: category.id,
        name: category.name,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        Products: category.Products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            sku: product.sku,
            price: product.price,
            photo: product.photo,
            quantity: product.quantity,
            categoryId: product.categoryId,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        })),
    };
};
exports.toCategoryResponse = toCategoryResponse;
const toCategoryResponseArray = (categories) => {
    return categories.map(category => ({
        id: category.id,
        name: category.name,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        Products: category.Products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            sku: product.sku,
            price: product.price,
            photo: product.photo,
            quantity: product.quantity,
            categoryId: product.categoryId,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        })),
    }));
};
exports.toCategoryResponseArray = toCategoryResponseArray;
