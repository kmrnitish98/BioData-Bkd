const mongoose = require('mongoose');
const dns = require('dns');

// Prevent querySrv ECONNREFUSED on networks/ISPs whose default DNS servers do not resolve SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Graceful fallback if restricted
}

const ensureIndexes = async (db) => {
  try {
    const col = db.collection('users');
    const indexes = await col.indexes();

    const emailIdx = indexes.find((i) => i.name === 'email_1' || (i.key && i.key.email === 1));
    if (emailIdx && !emailIdx.sparse) {
      console.log('Migrating email_1 index to sparse unique...');
      await col.dropIndex(emailIdx.name);
      await col.createIndex({ email: 1 }, { unique: true, sparse: true, background: true });
      console.log('email_1 index migrated to sparse unique successfully.');
    }

    const mobileIdx = indexes.find((i) => i.name === 'mobile_1' || (i.key && i.key.mobile === 1));
    if (!mobileIdx) {
      console.log('Creating mobile_1 sparse unique index...');
      await col.createIndex({ mobile: 1 }, { unique: true, sparse: true, background: true });
      console.log('mobile_1 index created successfully.');
    }
  } catch (err) {
    console.warn('⚠️ [Database] Index check note:', err.message);
  }
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      console.error('❌ MongoDB configuration error: Neither MONGO_URI nor MONGODB_URI environment variable is defined.');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    await ensureIndexes(conn.connection.db);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
