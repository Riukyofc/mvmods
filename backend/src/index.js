const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL, // Sua URL do GitHub Pages / Vercel
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por CORS'));
    }
  },
  credentials: true
}));

// Parse requests JSON and URL-encoded
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Http Logger (em ambiente dev mostra colorido)
app.use(morgan('dev'));

// Rotas da API
const productsRoutes = require('./routes/products');
const keysRoutes = require('./routes/keys');
const redeemRoutes = require('./routes/redeem');

app.use('/api/products', productsRoutes);
app.use('/api/keys', keysRoutes);
app.use('/api/redeem', redeemRoutes);

// Rota de Health Check
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: "MV Chart & Mods API Server is Online",
    version: "1.0.0"
  });
});

// Middleware 404
app.use(notFoundHandler);

// Middleware Central de Tratamento de Erros
app.use(errorHandler);

// Inicialização do Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[SV] Servidor inciado na porta ${PORT}`);
});
