const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.use('/api/auth', require('./route/authRoutes'));
app.use('/api/contact', require('./route/contactRoutes'));
app.use('/api/blog', require('./route/blogRoutes'));
app.use('/api/upload', require('./route/uploadRoutes'));

app.get('/', (req, res) => res.send('Inkwell Blog API v2.0 ✍️'));

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
