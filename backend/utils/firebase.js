const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const serviceAccount = require('../firebase-service-account.json'); // ✅ Your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'minimarket-fl.firebasestorage.app' // ✅ Your correct bucket name!
});

const bucket = admin.storage().bucket();

const uploadImageToFirebase = async (fileBuffer, fileName, mimeType) => {
  return new Promise((resolve, reject) => {
    const blob = bucket.file(`${Date.now()}_${fileName}`); // ✅ Adds timestamp for uniqueness
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: mimeType,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        }
      }
    });

    blobStream.on('error', (error) => {
      console.error("❌ Firebase upload error:", error);
      reject(error);
    });

    blobStream.on('finish', () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${blob.metadata.metadata.firebaseStorageDownloadTokens}`;
      resolve(publicUrl);
    });

    blobStream.end(fileBuffer);
  });
};

module.exports = { uploadImageToFirebase };
