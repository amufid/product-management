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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = require("../lib/prisma");
const responseError_1 = require("../lib/responseError");
const userModel_1 = require("../model/userModel");
const validation_1 = require("../validation/validation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    static register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const registerRequest = validation_1.Validation.validate(validation_1.Validation.USER, request);
            const findUser = yield prisma_1.prisma.users.findUnique({
                where: { email: registerRequest.email }
            });
            if (findUser) {
                throw new responseError_1.ResponseError(400, "Email is registered");
            }
            const hashPassword = yield bcrypt_1.default.hash(registerRequest.password, 10);
            const setData = Object.assign(Object.assign({}, registerRequest), {
                password: hashPassword,
                approved: false,
            });
            const register = yield prisma_1.prisma.users.create({
                data: setData
            });
            return (0, userModel_1.toUserResponse)(register);
        });
    }
    static login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginRequest = validation_1.Validation.validate(validation_1.Validation.LOGIN, request);
            const findUser = yield prisma_1.prisma.users.findUnique({
                where: { email: loginRequest.email }
            });
            if (!findUser) {
                throw new responseError_1.ResponseError(401, "Email or password wrong");
            }
            if (findUser.approved === false) {
                throw new responseError_1.ResponseError(401, "Invalid credentials");
            }
            const checkPassword = yield bcrypt_1.default.compare(loginRequest.password, findUser.password);
            if (!checkPassword) {
                throw new responseError_1.ResponseError(401, "Email or password wrong");
            }
            const secret = process.env.JWT_SECRET;
            const accessToken = jsonwebtoken_1.default.sign({
                id: findUser.id
            }, secret, {
                expiresIn: '7d'
            });
            return accessToken;
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield prisma_1.prisma.users.findMany();
            return {
                message: 'Success',
                data: users.map(user => (0, userModel_1.toUserResponse)(user))
            };
        });
    }
    static findOne(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.prisma.users.findUnique({
                where: { id: userId }
            });
            if (!user)
                throw new responseError_1.ResponseError(404, 'User not found');
            return (0, userModel_1.toUserResponse)(user);
        });
    }
    static update(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(validation_1.Validation.UserUpdate, request);
            yield this.findOne(userId);
            const user = yield prisma_1.prisma.users.update({
                where: {
                    id: userId
                },
                data: updateRequest
            });
            return (0, userModel_1.toUserResponse)(user);
        });
    }
    static remove(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield prisma_1.prisma.users.findUnique({
                where: { email: userEmail }
            });
            if (!findUser) {
                throw new responseError_1.ResponseError(404, 'User not found');
            }
            const user = yield prisma_1.prisma.users.delete({
                where: { email: findUser.email }
            });
            return (0, userModel_1.toUserResponse)(user);
        });
    }
    static approve(userEmail, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const approveRequest = validation_1.Validation.validate(validation_1.Validation.UserApprove, request);
            const findUser = yield prisma_1.prisma.users.findUnique({
                where: { email: userEmail }
            });
            if (!findUser) {
                throw new responseError_1.ResponseError(404, 'User not found');
            }
            const user = yield prisma_1.prisma.users.update({
                where: {
                    id: findUser.id
                },
                data: approveRequest
            });
            return (0, userModel_1.toUserResponse)(user);
        });
    }
}
exports.UserService = UserService;
