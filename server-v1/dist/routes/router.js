"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controller/productController");
const cloudinary_1 = require("../lib/cloudinary");
const categoryController_1 = require("../controller/categoryController");
const transactionController_1 = require("../controller/transactionController");
const locationController_1 = require("../controller/locationController");
const inventoryController_1 = require("../controller/inventoryController");
const userController_1 = require("../controller/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const warehouseController_1 = require("../controller/warehouseController");
const destinationController_1 = require("../controller/destinationController");
exports.router = express_1.default.Router();
// router public api user 
exports.router.post('/api/user/register', userController_1.UserController.register);
exports.router.post('/api/user/login', userController_1.UserController.login);
// only authenticated users can access
exports.router.use(authMiddleware_1.authentication);
// router private api user 
exports.router.get('/api/user/:id', userController_1.UserController.findOne);
exports.router.put('/api/user', userController_1.UserController.update);
exports.router.delete('/api/user/:id', userController_1.UserController.remove);
// router api trnsaction
exports.router.post('/api/transaction', transactionController_1.TransactionController.create);
exports.router.get('/api/transaction', transactionController_1.TransactionController.findAll);
exports.router.get('/api/transaction/:id', transactionController_1.TransactionController.findOne);
exports.router.put('/api/transaction/:id', transactionController_1.TransactionController.update);
// router api location 
exports.router.post('/api/location', locationController_1.LocationController.create);
exports.router.get('/api/location', locationController_1.LocationController.findAll);
exports.router.get('/api/location/:id', locationController_1.LocationController.findOne);
exports.router.put('/api/location/:id', locationController_1.LocationController.update);
exports.router.delete('/api/location/:id', locationController_1.LocationController.remove);
// router api inventory 
exports.router.post('/api/inventory', inventoryController_1.InventoryController.create);
exports.router.get('/api/inventory', inventoryController_1.InventoryController.findAll);
exports.router.get('/api/inventory/:id', inventoryController_1.InventoryController.findOne);
exports.router.put('/api/inventory/:id', inventoryController_1.InventoryController.update);
exports.router.delete('/api/inventory/:id', inventoryController_1.InventoryController.remove);
// router api warehouse 
exports.router.post('/api/warehouse', warehouseController_1.WarehouseController.create);
exports.router.get('/api/warehouse', warehouseController_1.WarehouseController.findAll);
exports.router.get('/api/warehouse/:id', warehouseController_1.WarehouseController.findOne);
exports.router.put('/api/warehouse/:id', warehouseController_1.WarehouseController.update);
exports.router.delete('/api/warehouse/:id', warehouseController_1.WarehouseController.remove);
// router api destination
exports.router.post('/api/destination', destinationController_1.DestinationController.create);
exports.router.get('/api/destination', destinationController_1.DestinationController.findAll);
exports.router.get('/api/destination/:id', destinationController_1.DestinationController.findOne);
exports.router.put('/api/destination/:id', destinationController_1.DestinationController.update);
exports.router.delete('/api/destination/:id', destinationController_1.DestinationController.remove);
// router api products
exports.router.get('/api/products', productController_1.ProductsController.findAll);
exports.router.get('/api/products/:id', productController_1.ProductsController.findOne);
// router api categories
exports.router.get('/api/categories', categoryController_1.CategoryController.findAll);
exports.router.get('/api/categories/:id', categoryController_1.CategoryController.findOne);
// only role admin can access
exports.router.use(authMiddleware_1.authorization);
// router api user 
exports.router.get('/api/user', userController_1.UserController.findAll);
// router api products 
exports.router.post('/api/products', productController_1.ProductsController.create);
exports.router.post('/api/products/uploadImage', cloudinary_1.upload.single('photo'), cloudinary_1.uploadToCloudinary, productController_1.ProductsController.uploadImage);
exports.router.put('/api/products/:id', productController_1.ProductsController.update);
exports.router.delete('/api/products/:id', productController_1.ProductsController.remove);
// router api categories 
exports.router.post('/api/categories', categoryController_1.CategoryController.create);
exports.router.put('/api/categories/:id', categoryController_1.CategoryController.update);
exports.router.delete('/api/categories/:id', categoryController_1.CategoryController.remove);
