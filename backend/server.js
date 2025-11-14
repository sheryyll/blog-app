const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config(); 
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');


const corsOptions = {
  origin: [
    'https://blog-app-smoky-tau.vercel.app',
    'https://blog-n2b7czrs8-jenishas-projects-e2c82fb2.vercel.app'
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
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

app.use('/api/articles', articlesRouter); 
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send("Backend running!");
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});