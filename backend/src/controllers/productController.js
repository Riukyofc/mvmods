const { db, bucket } = require('../config/firebaseAdmin');
const { v4: uuidv4 } = require('uuid');

const productsCollection = db.collection('products');

// Gerar URL assinada para upload direto (10GB)
exports.generatePresignedUrl = async (req, res, next) => {
  try {
    const { filename, contentType } = req.body;

    const uniqueFilename = `products/${uuidv4()}-${filename}`;
    const file = bucket.file(uniqueFilename);

    const options = {
      version: 'v4',
      action: 'resumable', 
      expires: Date.now() + 15 * 60 * 1000, 
    };

    if (contentType) options.contentType = contentType;

    const [url] = await file.getSignedUrl(options);

    res.status(200).json({
      success: true,
      data: {
        uploadUrl: url,
        filePath: uniqueFilename,
      },
      message: "URL gerada com sucesso."
    });
  } catch (error) {
    next(error);
  }
};

// Criar produto
exports.createProduct = async (req, res, next) => {
  try {
    const { title, description, image, demo, filePath, filesize } = req.body;

    const productData = {
      title,
      description: description || '',
      image: image || '',
      demo: demo || '',
      filePath, 
      filesize: filesize || '0 MB',
      createdAt: new Date().toISOString()
    };

    const docRef = await productsCollection.add(productData);

    res.status(201).json({
      success: true,
      data: { id: docRef.id, ...productData },
      message: "Produto criado com sucesso!"
    });
  } catch (error) {
    next(error);
  }
};

// Listar produtos
exports.getProducts = async (req, res, next) => {
  try {
    const snapshot = await productsCollection.orderBy('createdAt', 'desc').get();
    const products = [];
    
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Deletar produto
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await productsCollection.doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Produto não encontrado." });
    }

    const data = doc.data();
    
    if (data.filePath) {
      try {
        await bucket.file(data.filePath).delete();
      } catch (e) {
        console.warn("Arquivo já excluído ou não encontrado no GCS.");
      }
    }

    await productsCollection.doc(id).delete();

    res.status(200).json({ success: true, message: "Produto excluído com sucesso." });
  } catch (error) {
    next(error);
  }
};
