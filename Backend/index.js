const express = require('express');
const app = express();
const connectDB = require('./config/dbConnection');
const cors = require('cors');
require('dotenv').config();
const authRoutes= require('./routes/authRoutes');
const adminRoutes = require('./routes/userRoutes');
const projectRoutes =require('./routes/projectRoutes');
const bugRoutes = require('./routes/bugRoutes');
const path = require("path");
const PORT = process.env.PORT || 3500;

connectDB();
app.use(cors());
// Routes
app.use(express.json());

app.use("/authentication",authRoutes);
app.use('/admin',adminRoutes);
app.use("/project",projectRoutes);
app.use("/bugs",bugRoutes);
app.use("/public", express.static(path.join(__dirname, "public")));

app.listen(PORT,()=>console.log(`server running on port ${PORT}`));