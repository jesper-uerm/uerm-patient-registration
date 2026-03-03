const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const erRoutes = require('./routes/erRoutes');
const patientRoutes = require('./routes/patientRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors()); 

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/er', erRoutes);
app.use('/api/patients', patientRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API Running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});