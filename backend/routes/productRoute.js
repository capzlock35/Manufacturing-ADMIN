import express from 'express';
import { createProduct, getAllProducts, deleteProduct  } from '../controller/productController.js';

const router = express.Router();

// Route for creating a new product
router.post('/create', createProduct);

// Route for getting all products
router.get('/', getAllProducts);

// Route for deleting a product
router.delete('/:id', deleteProduct); 


export default router;
