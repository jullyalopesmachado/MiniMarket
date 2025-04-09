const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// ✅ Create a new deal (with auth)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, expirationDate } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newDeal = new Deal({
      title,
      description,
      expirationDate,
      businessName: user.businessName
    });

    await newDeal.save();

    res.status(201).json({ message: 'Deal created successfully', deal: newDeal });
  } catch (error) {
    console.error('❌ Error creating deal:', error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get active deals (filter by expiration date)
router.get('/view', async (req, res) => {
  try {
    const today = new Date();
    const activeDeals = await Deal.find({ expirationDate: { $gte: today } });
    res.json(activeDeals);
  } catch (error) {
    console.error('❌ Error fetching deals:', error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update deal
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, expirationDate } = req.body;

    const updatedDeal = await Deal.findByIdAndUpdate(
      req.params.id,
      { title, description, expirationDate },
      { new: true, runValidators: true }
    );

    if (!updatedDeal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    res.json({ message: 'Deal updated successfully', deal: updatedDeal });
  } catch (error) {
    console.error('❌ Error updating deal:', error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Delete deal
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedDeal = await Deal.findByIdAndDelete(req.params.id);

    if (!deletedDeal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting deal:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
