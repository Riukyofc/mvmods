const express = require('express');
const router = express.Router();
const redeemController = require('../controllers/redeemController');
const { redeemValidations } = require('../middlewares/validators');

// Rota pública para os clientes resgatarem as chaves
router.post('/validate', redeemValidations.validateKey, redeemController.validateAndRedeem);

module.exports = router;
