// src/routes/organizations.js;
const express = require('express');
const router = express.Router();
const { Organization, User } = require('../models');

// Create a new organization
router.post('/:id', async (req, res) => {
    try {
      // Find the user by the provided user ID in the URL parameter
      const user = await User.findById(req.params.id);
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Create the organization using the request body data and set the organizerId to the user ID
      const organization = new Organization({
        ...req.body,
        organizerId: req.params.id,  // Set the organizerId to the user ID from the URL
      });
  
      // Add the user to the organization's `users` array with the 'admin' role
      organization.users.push({ user: req.params.id, role: 'admin' });
  
      // Save the organization
      await organization.save();
  
      // Associate the organization with the user by adding it to the user's `organizations` array
      user.organizations.push(organization._id);
      await user.save();
  
      res.status(201).json(organization);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// Add user to organization
router.post('/:id/users', async (req, res) => {
  try {
    const { userId, role } = req.body;
    const organization = await Organization.findById(req.params.id);
    const user = await User.findById(userId);

    if (!organization || !user) {
      return res.status(404).json({ error: 'Organization or User not found' });
    }

    organization.users.push({ user: userId, role });
    user.organizations.push(organization._id);

    await organization.save();
    await user.save();

    res.json(organization);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Change user role in organization
router.put('/:id/users/:userId', async (req, res) => {
  try {
    const { role } = req.body;
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const userIndex = organization.users.findIndex(u => u.user.toString() === req.params.userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found in organization' });
    }

    organization.users[userIndex].role = role;
    await organization.save();

    res.json(organization);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;