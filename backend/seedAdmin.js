// backend/seedAdmin.js
require('dotenv').config();
const path = require('path');
const connectDB = require('./config/db'); // from seedAdmin.js
const User = require('./models/User');
const bcrypt = require('bcryptjs');

connectDB().then(async () => {
  try {
    const hashedPassword = await bcrypt.hash('Admin@1234', 12);
    
    const user = await User.findOneAndUpdate(
      { email: 'admin@thefolio.com' },
      {
        name: 'TheFolioAdmin',
        email: 'admin@thefolio.com',
        password: hashedPassword, // manually hashed
        role: 'admin',
        status: 'active',
      },
      { upsert: true, new: true }
    );

    console.log('Admin account created/updated successfully!');
    console.log('Email: admin@thefolio.com');
    console.log('Password: Admin@1234');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
});