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
exports.WarehouseController = void 0;
const warehouseService_1 = require("../service/warehouseService");
class WarehouseController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const response = yield warehouseService_1.WarehouseService.create(request);
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
                const response = yield warehouseService_1.WarehouseService.findAll();
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
                const warehouseId = Number(req.params.id);
                const response = yield warehouseService_1.WarehouseService.findOne(warehouseId);
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
                const warehouseId = Number(req.params.id);
                const request = req.body;
                const response = yield warehouseService_1.WarehouseService.update(warehouseId, request);
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
                const warehouseId = Number(req.params.id);
                yield warehouseService_1.WarehouseService.remove(warehouseId);
                res.status(200).json({ message: 'Success' });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.WarehouseController = WarehouseController;
