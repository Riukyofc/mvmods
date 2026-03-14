/**
 * Middleware centralizado de tratamento de erros
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro Interno do Servidor';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

/**
 * Rota não encontrada (404)
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.originalUrl}`
  });
};

module.exports = { errorHandler, notFoundHandler };
