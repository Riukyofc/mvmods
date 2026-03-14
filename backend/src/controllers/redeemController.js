const { db, bucket } = require('../config/firebaseAdmin');

const keysCollection = db.collection('keys');
const productsCollection = db.collection('products');

exports.validateAndRedeem = async (req, res, next) => {
  try {
    const { code } = req.body;

    const querySnapshot = await keysCollection.where('code', '==', code).get();
    
    if (querySnapshot.empty) {
      return res.status(404).json({ success: false, message: "Chave inválida ou não encontrada." });
    }

    const keyDoc = querySnapshot.docs[0];
    const keyData = keyDoc.data();
    const now = new Date();

    if (keyData.status === 'expired') {
      return res.status(403).json({ success: false, message: "Esta chave já está expirada." });
    }

    let expiresAt = keyData.expiresAt ? new Date(keyData.expiresAt) : null;

    if (!expiresAt) {
      expiresAt = new Date();
      expiresAt.setDate(now.getDate() + keyData.durationDays);
      
      await keyDoc.ref.update({
        expiresAt: expiresAt.toISOString(),
        redeemedAt: now.toISOString(),
        status: 'active'
      });
    } else if (now > expiresAt) {
      await keyDoc.ref.update({ status: 'expired' });
      return res.status(403).json({ success: false, message: "Esta chave expirou." });
    }

    const productDoc = await productsCollection.doc(keyData.productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({ success: false, message: "O produto vinculado a esta chave não existe mais." });
    }
    
    const productData = productDoc.data();
    let downloadUrl = null;
    
    if (productData.filePath) {
      const file = bucket.file(productData.filePath);
      const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 4 * 60 * 60 * 1000, // 4 hours
      };
      
      try {
        const [url] = await file.getSignedUrl(options);
        downloadUrl = url;
      } catch (err) {
        console.error("Erro ao gerar link de download:", err);
      }
    }

    res.status(200).json({
      success: true,
      message: "Chave validada com sucesso!",
      data: {
        product: {
          id: productDoc.id,
          title: productData.title,
          description: productData.description,
          image: productData.image,
          filesize: productData.filesize,
          expireDate: expiresAt.toLocaleDateString('pt-BR') + ' as ' + expiresAt.toLocaleTimeString('pt-BR'),
          downloadUrl: downloadUrl
        }
      }
    });

  } catch (error) {
    next(error);
  }
};
