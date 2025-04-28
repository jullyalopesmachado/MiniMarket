const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Load service account
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.resolve(__dirname, "../config/firebase-service-account.json");
const serviceAccount = require(serviceAccountPath);

// Initialize Firebase if not already done
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "minimarket-fl.firebasestorage.app", // ✅ Corrected here based on your Firebase Console
  });
}

const bucket = admin.storage().bucket();

// ✅ Upload image to Firebase
async function uploadImageToFirebase(buffer, filename, mimetype) {
  const file = bucket.file(`uploads/${Date.now()}-${filename}`);
  const uuid = uuidv4();

  await file.save(buffer, {
    metadata: {
      contentType: mimetype,
      metadata: {
        firebaseStorageDownloadTokens: uuid,
      },
    },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;
}

// ✅ Delete image from Firebase by URL
async function deleteImageFromFirebase(imageUrl) {
  const prefix = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/`;
  if (!imageUrl.startsWith(prefix)) return;

  const fullPathEncoded = imageUrl.split("/o/")[1]?.split("?")[0];
  if (!fullPathEncoded) return;

  const fullPath = decodeURIComponent(fullPathEncoded);
  await bucket.file(fullPath).delete().catch((err) => {
    console.warn("⚠️ Firebase deletion failed or skipped:", err.message);
  });
}

module.exports = { uploadImageToFirebase, deleteImageFromFirebase };
