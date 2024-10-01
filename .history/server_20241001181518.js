const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/project_management_poc', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/organizations', require('./routes/organizations'));
app.use('/api/projects', require('./routes/projects'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});