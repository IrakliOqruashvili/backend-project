const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const gunRoutes = require('./routes/gunRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Item', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// userRoutes under /api/users
app.use('/api/users', userRoutes);

// gunRoutes under /api/guns
app.use('/api/guns', gunRoutes);

// authRoutes under /api/auth
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
