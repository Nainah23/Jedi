// src/routes/organizations.js;
const express = require('express');
const router = express.Router();
const { Organization, User } = require('../models');

// Create a new organization
router.post('/:id', async (req, res) => {
  try {
    const organization = await User.findById(req.params.id);

    if (!organization || !user) {
      return res.status(404).json({ error: 'Organization or User not found' });
    }
    const organization = new Organization(req.body);
    await organization.save();
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