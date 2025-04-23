const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');
const authMiddleware = require('../middleware/auth');
const Opportunity = require('../models/Opportunities'); // Import the Opportunity model

// Fetch all opportunities (with pagination)
router.get('/view', opportunityController.getAllOpportunities);

// View all opportunites (without pagination)
router.get("/", async (req, res) => {
    try {
      const opportunities = await Opportunity.find()
        .sort({ createdAt: -1 }) // Sort by most recent
        .populate("businessId", "_id owner name"); // Populate business data (_id, owner, name)
  
      res.json(opportunities);
    } catch (error) {
      console.error("❌ Error fetching opportunities:", error);
      res.status(500).json({ message: error.message });
    }
  });

// Fetch a single opportunity by ID
router.get('/:id', authMiddleware, opportunityController.getOpportunityById);

// Create a new opportunity (protected route)
router.post('/new', authMiddleware, opportunityController.createOpportunity);

// Update an opportunity (protected route)
router.put('/update/:id', authMiddleware, opportunityController.updateOpportunity);

// Delete an opportunity (protected route)
router.delete('/delete/:id', authMiddleware, opportunityController.deleteOpportunity);

module.exports = router;