const { validationResult, check } = require('express-validator');

// Middleware Genérico para retornar erros do express-validator
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erros de validação nos dados enviados.',
      errors: errors.array()
    });
  }
  next();
};

// Validações para Produtos
const productValidations = {
  presignedUrl: [
    check('filename').notEmpty().withMessage('O nome do arquivo (filename) é obrigatório.'),
    validateRequest
  ],
  createProduct: [
    check('title').notEmpty().withMessage('O título do produto é obrigatório.'),
    check('filePath').notEmpty().withMessage('O caminho do arquivo (filePath) é obrigatório para ligar ao Storage.'),
    validateRequest
  ]
};

// Validações para Keys
const keyValidations = {
  createKey: [
    check('productId').notEmpty().withMessage('O ID do Produto é obrigatório.'),
    check('duration').isIn(['1_day', '1_week', '1_month']).withMessage('Duração inválida. Use 1_day, 1_week, ou 1_month.'),
    validateRequest
  ]
};

// Validações para Resgate (Redeem)
const redeemValidations = {
  validateKey: [
    check('code').notEmpty().withMessage('A chave de acesso é obrigatória.'),
    validateRequest
  ]
};

module.exports = {
  productValidations,
  keyValidations,
  redeemValidations
};
