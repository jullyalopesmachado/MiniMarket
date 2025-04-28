const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');
const authMiddleware = require('../middleware/auth');
const Opportunity = require('../models/Opportunities'); // Import the Opportunity model
const Business = require('../models/Business'); // Import the Business model

// Create a new opportunity (protected route)
router.post('/new', authMiddleware(["owner", "admin"]), async (req, res) => {

    try {
    const { userId, title, description, type, location, is_paid, amount, businessId, posted_by } = req.body;

    console.log('Request body:', req.body);

    
    // Ensure the user is authenticated and has a business
       if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. User must be logged in to create an opportunity.'
      });
    }
  
    console.log('Authenticated user ID:', userId);
    
  
      if (!title || !description || !type || !location || !businessId || !posted_by) {
        console.log("Validation failed: Missing required fields");
        return res.status(400).json({ message: "All fields are required." });
      }



      // Create the new opportunity
      console.log('Creating opportunity for business:', businessId);
      const newOpportunity = new Opportunity({
        userId,
        title,
        description,
        type,
        location,
        businessId,
        posted_by,
        is_paid,
        amount: is_paid ? amount : 0, // Set amount only if is_paid is true
     
      });

      console.log('New opportunity:', newOpportunity);
  
      await newOpportunity.save();
      console.log('New opportunity created:', newOpportunity);
  
      res.status(201).json({ success: true, opportunity: newOpportunity });
    } catch (error) {
      console.error('Error creating opportunity:', error);
      res.status(500).json({ success: false, message: 'Failed to create opportunity' });
    }
  });


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


// Update an opportunity (protected route)
router.put('/update/:id', authMiddleware, opportunityController.updateOpportunity);

// Delete an opportunity (protected route)
router.delete('/delete/:id', authMiddleware, opportunityController.deleteOpportunity);

module.exports = router;