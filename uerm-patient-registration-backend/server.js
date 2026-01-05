const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors()); 

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API Running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});