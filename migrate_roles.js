const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const User = require('./models/User');
    
    // Set all previous admins to role='admin', drop isAdmin
    const admins = await User.updateMany(
      { isAdmin: true },
      { $set: { role: 'admin' }, $unset: { isAdmin: "" } }
    );
    console.log('Migrated admins to role "admin":', admins.modifiedCount);

    // Set all other users to role='user', drop isAdmin
    const users = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'user' }, $unset: { isAdmin: "" } }
    );
    console.log('Migrated users to role "user":', users.modifiedCount);

    // Specifically ensure digitalyodha98@gmail.com is admin
    const digitalYodha = await User.findOneAndUpdate(
      { email: 'digitalyodha98@gmail.com' },
      { $set: { role: 'admin' }, $unset: { isAdmin: "" } },
      { new: true }
    );
    console.log('Verified digitalyodha98:', digitalYodha ? digitalYodha.role : 'not found');

    const allUsers = await User.find({}, 'name email role isAdmin');
    console.log('\nFinal User Roles:');
    console.log(JSON.stringify(allUsers, null, 2));

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
