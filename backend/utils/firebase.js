const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// ✅ Automatically load the path from .env or fallback to default
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.resolve(__dirname, "../config/firebase-service-account.json");

const serviceAccount = require(serviceAccountPath);

// ✅ Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "minimarket-fl.firebasestorage.app", // 🔁 Replace with your actual bucket name
  });
}

const bucket = admin.storage().bucket();

// ✅ Function to upload image buffer to Firebase Storage
async function uploadImageToFirebase(buffer, filename, mimetype) {
  const file = bucket.file(`uploads/${Date.now()}-${filename}`);
  const uuid = uuidv4();

  await file.save(buffer, {
    metadata: {
      contentType: mimetype,
      metadata: {
        firebaseStorageDownloadTokens: uuid
      }
    }
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;
}

module.exports = { uploadImageToFirebase };
