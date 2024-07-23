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
exports.DestinationService = void 0;
const prisma_1 = require("../lib/prisma");
const responseError_1 = require("../lib/responseError");
const destinationModel_1 = require("../model/destinationModel");
const validation_1 = require("../validation/validation");
class DestinationService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(validation_1.Validation.DESTINATION, request);
            const destination = yield prisma_1.prisma.destination.create({
                data: createRequest
            });
            return (0, destinationModel_1.toDestinationResponse)(destination);
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const destinations = yield prisma_1.prisma.destination.findMany();
            return {
                message: 'Success',
                data: destinations.map(destination => (0, destinationModel_1.toDestinationResponse)(destination))
            };
        });
    }
    static findOne(destinationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const destination = yield prisma_1.prisma.destination.findUnique({
                where: { id: destinationId }
            });
            if (!destination)
                throw new responseError_1.ResponseError(404, 'Destination not found');
            return (0, destinationModel_1.toDestinationResponse)(destination);
        });
    }
    static update(destinationId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(validation_1.Validation.DESTINATION, request);
            yield this.findOne(destinationId);
            const destination = yield prisma_1.prisma.destination.update({
                where: {
                    id: destinationId
                },
                data: updateRequest
            });
            return (0, destinationModel_1.toDestinationResponse)(destination);
        });
    }
    static remove(destinationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.findOne(destinationId);
            const destination = yield prisma_1.prisma.destination.delete({
                where: { id: destinationId }
            });
            return (0, destinationModel_1.toDestinationResponse)(destination);
        });
    }
}
exports.DestinationService = DestinationService;
