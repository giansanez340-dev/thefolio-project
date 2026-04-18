// backend/seedAdmin.js
require('dotenv').config();
const path = require('path');
const connectDB = require('./config/db'); // from seedAdmin.js
const User = require('./models/User');

connectDB().then(async () => {
  try {
    const exists = await User.findOne({ email: 'admin@thefolio.com' });
    if (exists) {
      console.log('Admin account already exists.');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'TheFolioAdmin',
      email: 'admin@thefolio.com',
      password: 'Admin@1234', // pre-save hook in User model hashes this
      role: 'admin',
      status: 'active',
    });

    console.log('Admin account created successfully!');
    console.log('Email: admin@thefolio.com');
    console.log('Password: Admin@1234');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
});