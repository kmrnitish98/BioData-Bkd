const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const User = require('./models/User');
    
    const user = await User.findOneAndUpdate(
      { email: 'digitalyodha98@gmail.com' },
      { $set: { isAdmin: true } },
      { new: true }
    );
    
    if (user) {
      console.log('User updated successfully to admin:', user.email, 'isAdmin:', user.isAdmin);
    } else {
      console.log('User not found.');
    }
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
