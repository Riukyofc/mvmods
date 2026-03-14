const { admin } = require('../config/firebaseAdmin');

/**
 * Middleware para verificar o token JWT do Firebase (Admin Auth)
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticação não fornecido ou formato inválido.'
    });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Trava de segurança: Apenas o email do proprietário pode acessar rotas Admin
    if (decodedToken.email !== 'alexcastrocutrim@gmail.com') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas o administrador principal pode realizar esta ação.'
      });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error.message);
    return res.status(403).json({
      success: false,
      message: 'Token inválido ou expirado.'
    });
  }
};

module.exports = { verifyToken };
