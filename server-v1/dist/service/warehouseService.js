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
exports.WarehouseService = void 0;
const prisma_1 = require("../lib/prisma");
const responseError_1 = require("../lib/responseError");
const warehouseModel_1 = require("../model/warehouseModel");
const validation_1 = require("../validation/validation");
class WarehouseService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const warehouseRequest = validation_1.Validation.validate(validation_1.Validation.WAREHOUSE, request);
            const warehouse = yield prisma_1.prisma.warehouse.create({
                data: warehouseRequest
            });
            return (0, warehouseModel_1.toWarehouseResponse)(warehouse);
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const warehouses = yield prisma_1.prisma.warehouse.findMany();
            return {
                message: 'Success',
                data: warehouses.map(warehouse => (0, warehouseModel_1.toWarehouseResponse)(warehouse))
            };
        });
    }
    static findOne(warehouseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const warehouse = yield prisma_1.prisma.warehouse.findUnique({
                where: { id: warehouseId }
            });
            if (!warehouse)
                throw new responseError_1.ResponseError(404, 'Warehouse not found');
            return (0, warehouseModel_1.toWarehouseResponse)(warehouse);
        });
    }
    static update(warehouseId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const warehouseRequest = validation_1.Validation.validate(validation_1.Validation.WAREHOUSE, request);
            yield this.findOne(warehouseId);
            const warehouse = yield prisma_1.prisma.warehouse.update({
                where: {
                    id: warehouseId
                },
                data: warehouseRequest
            });
            return (0, warehouseModel_1.toWarehouseResponse)(warehouse);
        });
    }
    static remove(warehouseId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.findOne(warehouseId);
            const warehouse = yield prisma_1.prisma.warehouse.delete({
                where: { id: warehouseId }
            });
            return (0, warehouseModel_1.toWarehouseResponse)(warehouse);
        });
    }
}
exports.WarehouseService = WarehouseService;
