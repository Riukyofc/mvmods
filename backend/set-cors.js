const { bucket } = require('./src/config/firebaseAdmin');

async function configureCors() {
  try {
    const [metadata] = await bucket.getMetadata();
    console.log("Current CORS:", metadata.cors);

    await bucket.setCorsConfiguration([
      {
        maxAgeSeconds: 3600,
        method: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'HEAD'],
        origin: ['*'],
        responseHeader: ['Content-Type', 'Authorization', 'Content-Length', 'User-Agent', 'x-goog-resumable'],
      },
    ]);

    console.log("CORS configured successfully.");
  } catch (err) {
    console.error("Error setting CORS:", err);
  }
}

configureCors();
