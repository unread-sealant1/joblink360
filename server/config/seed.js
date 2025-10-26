const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');

// Load environment variables from root directory
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI not found in environment variables');
      console.log('Please set MONGO_URI in your .env file');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@cmmmultiverse.co.za' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Generate strong password
    const adminPassword = crypto.randomBytes(16).toString('hex');
    console.log('Generated Admin Password:', adminPassword);

    // Create admin user
    const admin = await User.create({
      name: 'JobLink360 Admin',
      email: 'admin@cmmmultiverse.co.za',
      password: adminPassword,
      title: 'Platform Administrator',
      bio: 'JobLink360 Platform Administrator',
      isAdmin: true
    });

    console.log('Admin user created successfully');
    console.log('Admin Email: admin@cmmmultiverse.co.za');
    console.log('Admin Password:', adminPassword);
    console.log('IMPORTANT: Save this password securely!');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedAdmin();