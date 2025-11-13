const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config(); 
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');


const corsOptions = {
  origin: 'https://blog-app-smoky-tau.vercel.app'
};

app.use(cors(corsOptions));

app.use(express.json()); 


const uri = process.env.ATLAS_URI; 
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});
connection.on('error', (err) => {
  console.error("❌ MongoDB connection error:", err);
});


const articlesRouter = require('./routes/articles');
const authRouter = require('./routes/auth');

app.use('/articles', articlesRouter); 
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});