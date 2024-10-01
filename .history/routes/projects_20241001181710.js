const express = require('express');
const router = express.Router();
const { Project, User, Organization } = require('../models');

// Create a new project
router.post('/', async (req, res) => {
  try {
    const { name, description, organizationId, ownerId } = req.body;
    const project = new Project({ name, description, organization: organizationId, owner: ownerId });
    
    const user = await User.findById(ownerId);
    const organization = await Organization.findById(organizationId);

    if (!user || !organization) {
      return res.status(404).json({ error: 'User or Organization not found' });
    }

    const userRole = organization.users.find(u => u.user.toString() === ownerId)?.role;

    project.activities.push({
      user: ownerId,
      action: 'created',
      userRole,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  try {
    const { name, description, userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const organization = await Organization.findById(project.organization);
    const userRole = organization.users.find(u => u.user.toString() === userId)?.role;

    if (name) project.name = name;
    if (description) project.description = description;

    project.activities.push({
      user: userId,
      action: 'updated',
      userRole,
    });

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all projects for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const projects = await Project.find({
      $or: [
        { owner: user._id },
        { organization: { $in: user.organizations } }
      ]
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;