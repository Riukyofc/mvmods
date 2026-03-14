const admin = require('firebase-admin');

// No ambiente de produção, certifique-se de fornecer o serviceAccountKey.json
// ou usar as variáveis de ambiente do Google Cloud (Application Default Credentials).
try {
  let serviceAccount;
  
  // Se houver uma variável com o JSON completo (Recomendado para Railway/Vercel/Render)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } 
  // Caso contrário, tenta pelo caminho do arquivo
  else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  }

  admin.initializeApp({
    credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault(),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });

  console.log("Firebase Admin Initialized Successfully");
} catch (error) {
  console.log("Firebase Admin Initialization Error (se você ainda não configurou as credenciais, ignore por enquanto):", error.message);
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
