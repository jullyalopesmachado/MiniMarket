const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');
const authMiddleware = require('../middleware/auth');

// Fetch all opportunities (with pagination)
router.get('/view', opportunityController.getAllOpportunities);

// Fetch a single opportunity by ID
router.get('/:id', opportunityController.getOpportunityById);

// Create a new opportunity (protected route)
router.post('/new', opportunityController.createOpportunity);

// Update an opportunity (protected route)
router.put('/update/:id', authMiddleware, opportunityController.updateOpportunity);

// Delete an opportunity (protected route)
router.delete('/delete/:id', authMiddleware, opportunityController.deleteOpportunity);

module.exports = router;