const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { productValidations } = require('../middlewares/validators');
const { verifyToken } = require('../middlewares/authMiddleware');

// Rotas abertas (públicas)
router.get('/', productController.getProducts);

// Rotas protegidas (Admin)
// O admin precisa solicitar uma URL para upload gigante
router.post('/presigned-url', verifyToken, productValidations.presignedUrl, productController.generatePresignedUrl);

// O admin cria o registro no DB após o upload
router.post('/', verifyToken, productValidations.createProduct, productController.createProduct);

// O admin pode deletar
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;
