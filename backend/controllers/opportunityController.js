const Opportunity = require('../models/Opportunities');
const mongoose = require('mongoose');
const Business = require('../models/Business'); // Assuming you have a Business model
const express = require('express');
const router = express.Router();

class OpportunityController {

  // GET all opportunities with optional filters and pagination
  async getAllOpportunities(req, res) {
    const { page = 1, limit = 10, title, type, location } = req.query;

    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ success: false, message: 'Page and limit must be numbers' });
    }

    try {
      const query = {};

      if (title) {
        query.title = { $regex: title, $options: 'i' };
      }
      if (type) {
        query.type = { $regex: type, $options: 'i' };
      }
      if (location) {
        query.location = { $regex: location, $options: 'i' };
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

    if (!id) {
      return res.status(400).json({ success: false, message: 'Invalid opportunity ID' });
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: 'No updates provided' });
    }

    try {
      const updatedOpportunity = await Opportunity.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
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
