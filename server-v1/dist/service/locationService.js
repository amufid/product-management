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
exports.LocationService = void 0;
const prisma_1 = require("../lib/prisma");
const responseError_1 = require("../lib/responseError");
const locationModel_1 = require("../model/locationModel");
const validation_1 = require("../validation/validation");
class LocationService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(validation_1.Validation.LOCATION, request);
            const location = yield prisma_1.prisma.location.create({
                data: createRequest
            });
            return (0, locationModel_1.toLocationResponse)(location);
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const locations = yield prisma_1.prisma.location.findMany();
            return {
                message: 'Success',
                data: locations.map(location => (0, locationModel_1.toLocationResponse)(location))
            };
        });
    }
    static findOne(locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = yield prisma_1.prisma.location.findUnique({
                where: { id: locationId }
            });
            if (!location) {
                throw new responseError_1.ResponseError(404, 'Location not found');
            }
            return (0, locationModel_1.toLocationResponse)(location);
        });
    }
    static update(locationId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(validation_1.Validation.LOCATION, request);
            const findLocation = yield this.findOne(locationId);
            const location = yield prisma_1.prisma.location.update({
                where: {
                    id: findLocation.id
                },
                data: updateRequest
            });
            return (0, locationModel_1.toLocationResponse)(location);
        });
    }
    static remove(locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const findLocation = yield this.findOne(locationId);
            const location = yield prisma_1.prisma.location.delete({
                where: { id: findLocation.id }
            });
            return (0, locationModel_1.toLocationResponse)(location);
        });
    }
}
exports.LocationService = LocationService;
