const { db } = require('../config/firebaseAdmin');

const keysCollection = db.collection('keys');
const productsCollection = db.collection('products');

function generateLicenseKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const getChunk = () => Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `MV-${getChunk()}-${getChunk()}-${getChunk()}`;
}

const durationToDays = {
  '1_day': 1,
  '1_week': 7,
  '1_month': 30
};

exports.generateKey = async (req, res, next) => {
  try {
    const { productId, duration } = req.body;

    const productDoc = await productsCollection.doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({ success: false, message: "Produto não encontrado." });
    }

    const newKey = generateLicenseKey();
    
    const keyData = {
      code: newKey,
      productId: productId,
      duration: duration,
      durationLabel: duration === '1_day' ? '1 Dia (Trial)' : duration === '1_week' ? '1 Semana' : '1 Mês (Premium)',
      createdAt: new Date().toISOString(),
      expiresAt: null, 
      durationDays: durationToDays[duration],
      status: 'active', 
      redeemedAt: null
    };

    const docRef = await keysCollection.add(keyData);

    res.status(201).json({
      success: true,
      data: { id: docRef.id, ...keyData },
      message: "Key gerada com sucesso!"
    });
  } catch (error) {
    next(error);
  }
};

exports.getKeys = async (req, res, next) => {
  try {
    const snapshot = await keysCollection.orderBy('createdAt', 'desc').get();
    const keys = [];
    
    snapshot.forEach(doc => {
      keys.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({
      success: true,
      data: keys
    });
  } catch (error) {
    next(error);
  }
};
