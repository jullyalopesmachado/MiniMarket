import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ Enable Mongoose debug mode
mongoose.set('debug', true);

// ✅ Environment variable check
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error("❌ Missing environment variables. Check your .env file.");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
})
  .then(() => console.log(`✅ Connected to MongoDB -> ${mongoose.connection.name}`))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const addRoleToExistingUsers = async () => {
  try {

    const result = await User.updateMany(
      { name: 'Cornelia S'  }, // Match documents where `role` does not exist
      { $set: { role: 'admin' } }    // Set the default role to 'user'
    );

    console.log(`✅ Updated ${result.modifiedCount} users to include the 'role' field.`);
  } catch (error) {
    console.error("❌ Error updating users:", error.message);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  }
};

addRoleToExistingUsers();