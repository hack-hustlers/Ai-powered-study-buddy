const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors()); 
app.use(express.json()); 
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/studybuddyDB')
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
const authRoutes = require('./routes/auth.js');
const aiRoutes = require('./routes/ai.js');
app.use('/api/auth', authRoutes); 
app.use('/api', aiRoutes); 
app.get('/', (req, res) => {
    res.send('AI Study Buddy Backend is Running!');
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});