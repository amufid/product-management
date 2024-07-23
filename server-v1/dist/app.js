"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const router_1 = require("./routes/router");
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json({ limit: '5mb' }));
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, cors_1.default)());
exports.app.use((0, morgan_1.default)('dev'));
exports.app.use(router_1.router);
exports.app.use(errorHandler_1.errorHandler);
exports.app.listen(5000, () => {
    console.log(`Server running at port 5000`);
});
