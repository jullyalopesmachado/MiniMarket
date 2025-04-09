const Opportunity = require('../models/Opportunities');
const User = require('../models/User');
const mongoose = require('mongoose');

class OpportunityController {

    // GET all opportunities
    async getAllOpportunities(req, res) {
        const { page = 1, limit = 10, title, type, location } = req.query;

        if (isNaN(page) || isNaN(limit)) {
            return res.status(400).json({ success: false, message: 'Page and limit must be numbers' });
        }

    try {
        // Build the query based on filters
        const query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
        }
        if (type) {
            query.type = { $regex: type, $options: 'i' }; // Case-insensitive search
        }
        if (location) {
            query.location = { $regex: location, $options: 'i' }; // Case-insensitive search
        }

        const opportunities = await Opportunity.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Opportunity.countDocuments(query);

        res.status(200).json({
            success: true,
            opportunities,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
        
        });
    } catch (error) {
        console.error('Error fetching opportunities:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch opportunities' });
    }

}

// POST create a new opportunity
async createOpportunity(req, res) {
    const { title, description, type, location } = req.body;

    const user = await User.findById(req.user._id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

    // Validate required fields
    if (!title || !description || !type ) {
        return res.status(400).json({ 
            success: false,
             message: 'All fields are required' });
    }



    try {
        const newOpportunity = new Opportunity({
            title,
            description,
            type,
            location: location || 'Not specified',
            posted_by: user.businessName, // Assuming user.businessName is available in the request context
        });

        await newOpportunity.save();

        res.status(201).json({ success: true, opportunity: newOpportunity });
    } catch (error) {
        console.error('Error creating opportunity:', error);
        res.status(500).json({ success: false, message: 'Failed to create opportunity' });
    }
}

// GET opportunity by ID
async getOpportunityById(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: 'Invalid opportunity ID' });
    }
    try {
        const opportunity = await Opportunity.findById(id);

        if (!opportunity) {
            return res.status(404).json({ success: false, message: 'Opportunity not found' });
        }

        res.status(200).json({ success: true, opportunity });
    } catch (error) {
        console.error('Error fetching opportunity:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch opportunity' });
    }

}

// PUT update opportunity
async updateOpportunity(req, res) {
    const { id } = req.params;
    const updates = req.body;

    // Validate ObjectId
    if (!id) {
        return res.status(400).json({ success: false, message: 'Invalid opportunity ID' });
    }

    // Check for empty updates
    if (!Object.keys(updates).length) {
        return res.status(400).json({ success: false, message: 'No updates provided' });
    }

    try {
        const updatedOpportunity = await Opportunity.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!updatedOpportunity) {
            return res.status(404).json({ success: false, message: 'Opportunity not found' });
        }

        res.status(200).json({ success: true, opportunity: updatedOpportunity });
    } catch (error) {
        console.error('Error updating opportunity:', error);
        res.status(500).json({ success: false, message: 'Failed to update opportunity' });
    }
}

// DELETE opportunity
async deleteOpportunity(req, res) {
    const { id } = req.params;

    // Validate ObjectId
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ success: false, message: 'Invalid opportunity ID' });
    }


    try {
        const deletedOpportunity = await Opportunity.findByIdAndDelete(id);

        if (!deletedOpportunity) {
            return res.status(404).json({ success: false, message: 'Opportunity not found' });
        }

        res.status(200).json({ success: true, message: 'Opportunity deleted successfully' });
    } catch (error) {
        console.error('Error deleting opportunity:', error);
        res.status(500).json({ success: false, message: 'Failed to delete opportunity' });
    }
}

}

module.exports = new OpportunityController();
