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
exports.InventoryController = void 0;
const inventoryService_1 = require("../service/inventoryService");
class InventoryController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const response = yield inventoryService_1.InventoryService.create(request);
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
                const response = yield inventoryService_1.InventoryService.findAll();
                res.status(201).json(response);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static findOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inventoryId = Number(req.params.id);
                const response = yield inventoryService_1.InventoryService.findOne(inventoryId);
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
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inventoryId = Number(req.params.id);
                const request = req.body;
                const response = yield inventoryService_1.InventoryService.update(inventoryId, request);
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
    static remove(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inventoryId = Number(req.params.id);
                const response = yield inventoryService_1.InventoryService.remove(inventoryId);
                res.status(201).json({ message: 'Success' });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.InventoryController = InventoryController;
