import express from 'express'
import { ProductsController } from '../controller/productController'
import { upload, uploadToCloudinary } from '../lib/cloudinary'
import { CategoryController } from '../controller/categoryController'
import { TransactionController } from '../controller/transactionController'
import { LocationController } from '../controller/locationController'
import { InventoryController } from '../controller/inventoryController'
import { UserController } from '../controller/userController'
import { authentication, authorization } from '../middleware/authMiddleware'
import { WarehouseController } from '../controller/warehouseController'
import { DestinationController } from '../controller/destinationController'

export const router = express.Router()

// router public api user 
router.post('/api/user/register', UserController.register)
router.post('/api/user/login', UserController.login)

// only authenticated users can access
router.use(authentication)

// router private api user 
router.get('/api/user/:id', UserController.findOne)
router.put('/api/user', UserController.update)
router.delete('/api/user/:id', UserController.remove)

// router api trnsaction
router.post('/api/transaction', TransactionController.create)
router.get('/api/transaction', TransactionController.findAll)
router.get('/api/transaction/:id', TransactionController.findOne)
router.put('/api/transaction/:id', TransactionController.update)

// router api location 
router.post('/api/location', LocationController.create)
router.get('/api/location', LocationController.findAll)
router.get('/api/location/:id', LocationController.findOne)
router.put('/api/location/:id', LocationController.update)
router.delete('/api/location/:id', LocationController.remove)

// router api inventory 
router.post('/api/inventory', InventoryController.create)
router.get('/api/inventory', InventoryController.findAll)
router.get('/api/inventory/:id', InventoryController.findOne)
router.put('/api/inventory/:id', InventoryController.update)
router.delete('/api/inventory/:id', InventoryController.remove)

// router api warehouse 
router.post('/api/warehouse', WarehouseController.create)
router.get('/api/warehouse', WarehouseController.findAll)
router.get('/api/warehouse/:id', WarehouseController.findOne)
router.put('/api/warehouse/:id', WarehouseController.update)
router.delete('/api/warehouse/:id', WarehouseController.remove)

// router api destination
router.post('/api/destination', DestinationController.create)
router.get('/api/destination', DestinationController.findAll)
router.get('/api/destination/:id', DestinationController.findOne)
router.put('/api/destination/:id', DestinationController.update)
router.delete('/api/destination/:id', DestinationController.remove)

// router api products
router.get('/api/products', ProductsController.findAll)
router.get('/api/products/:id', ProductsController.findOne)

// router api categories
router.get('/api/categories', CategoryController.findAll)
router.get('/api/categories/:id', CategoryController.findOne)

// only role admin can access
router.use(authorization)

// router api user 
router.get('/api/user', UserController.findAll)

// router api products 
router.post('/api/products', ProductsController.create)
router.post('/api/products/uploadImage', upload.single('photo'), uploadToCloudinary, ProductsController.uploadImage)
router.put('/api/products/:id', ProductsController.update)
router.delete('/api/products/:id', ProductsController.remove)

// router api categories 
router.post('/api/categories', CategoryController.create)
router.put('/api/categories/:id', CategoryController.update)
router.delete('/api/categories/:id', CategoryController.remove)
