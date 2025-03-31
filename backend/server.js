const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // ✅ FIXED: Replaced bcrypt with bcryptjs
const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');
const businessRoutes = require('./routes/businessRoutes');
const apiRoutes = require('./models/api');
const authMiddleware = require('./middleware/auth');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORS
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// ✅ Middleware
app.use(express.json());
mongoose.set('debug', true);

// ✅ Env check
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    console.error("❌ Missing environment variables. Check your .env file.");
    process.exit(1);
}

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
})
    .then(() => {
        console.log("✅ Connected to MongoDB ->", mongoose.connection.name);
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// ✅ Login Route (manual token + password comparison)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/business', businessRoutes);
app.use('/api', apiRoutes)

// ✅ Protected route
app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        console.error("❌ Profile Fetch Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Error handling
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.stack);
    res.status(500).send('Something broke!');
});

// ✅ Start server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
