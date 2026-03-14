const express = require('express');
const router = express.Router();
const keyController = require('../controllers/keyController');
const { keyValidations } = require('../middlewares/validators');
const { verifyToken } = require('../middlewares/authMiddleware');

// Rotas protegidas (Apenas Admin pode gerar e ver keys)
router.use(verifyToken);

router.post('/', keyValidations.createKey, keyController.generateKey);
router.get('/', keyController.getKeys);

module.exports = router;
