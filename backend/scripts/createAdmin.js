require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@petadoption.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists with email:', adminEmail);
      
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated existing user to admin role');
      }
    } else {
      const admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });

      console.log('\n✅ Admin user created successfully!');
      console.log('-----------------------------------');
      console.log('Email:', admin.email);
      console.log('Password:', adminPassword);
      console.log('Role:', admin.role);
      console.log('-----------------------------------');
      console.log('\nYou can now login with these credentials.');
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
