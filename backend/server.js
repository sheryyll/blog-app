// In server.js (simplified)
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config(); // For environment variables

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows your React app to talk to this server
app.use(express.json()); // Allows server to accept JSON in request body

// Connect to MongoDB
const uri = process.env.ATLAS_URI; // Your connection string from MongoDB Atlas
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});
connection.on('error', (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// --- Import and use routes ---
const articlesRouter = require('./routes/articles');
const authRouter = require('./routes/auth');

app.use('/articles', articlesRouter); // All routes in articles.js will be prefixed with /articles
app.use('/auth', authRouter); // Authentication routes

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});