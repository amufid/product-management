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
exports.InventoryService = void 0;
const prisma_1 = require("../lib/prisma");
const responseError_1 = require("../lib/responseError");
const inventoryModel_1 = require("../model/inventoryModel");
const validation_1 = require("../validation/validation");
class InventoryService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(validation_1.Validation.INVENTORY, request);
            const inventory = yield prisma_1.prisma.inventory.create({
                data: createRequest
            });
            return (0, inventoryModel_1.toInventoryResponse)(inventory);
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const inventories = yield prisma_1.prisma.inventory.findMany();
            return {
                message: 'Success',
                data: inventories.map(inventory => (0, inventoryModel_1.toInventoryResponse)(inventory))
            };
        });
    }
    static findOne(inventoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const inventory = yield prisma_1.prisma.inventory.findUnique({
                where: { id: inventoryId }
            });
            if (!inventory) {
                throw new responseError_1.ResponseError(404, 'Inventory not found');
            }
            return (0, inventoryModel_1.toInventoryResponse)(inventory);
        });
    }
    static update(inventoryId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(validation_1.Validation.INVENTORY, request);
            yield this.findOne(inventoryId);
            const inventory = yield prisma_1.prisma.inventory.update({
                where: {
                    id: inventoryId
                },
                data: updateRequest
            });
            return (0, inventoryModel_1.toInventoryResponse)(inventory);
        });
    }
    static remove(inventoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.findOne(inventoryId);
            const inventory = yield prisma_1.prisma.inventory.delete({
                where: { id: inventoryId }
            });
            return (0, inventoryModel_1.toInventoryResponse)(inventory);
        });
    }
}
exports.InventoryService = InventoryService;
