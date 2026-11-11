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

const ensureBiodataShortIds = async (db) => {
  try {
    const col = db.collection('biodatas');
    const indexes = await col.indexes();
    const shortIdIdx = indexes.find((i) => i.name === 'shortId_1' || (i.key && i.key.shortId === 1));
    if (!shortIdIdx) {
      await col.createIndex({ shortId: 1 }, { unique: true, sparse: true, background: true });
    }

    const unmigrated = await col.find({
      $or: [{ shortId: { $exists: false } }, { shortId: null }, { shortId: '' }]
    }).toArray();

    if (unmigrated.length > 0) {
      console.log(`[Biodata] Backfilling unique shortId for ${unmigrated.length} records...`);
      const crypto = require('crypto');
      for (const doc of unmigrated) {
        let candidate = doc._id.toString().substring(0, 8).toLowerCase();
        const exists = await col.findOne({ shortId: candidate, _id: { $ne: doc._id } });
        if (exists) {
          let unique = false;
          while (!unique) {
            candidate = crypto.randomBytes(4).toString('hex').toLowerCase();
            const cExists = await col.findOne({ shortId: candidate });
            if (!cExists) unique = true;
          }
        }
        await col.updateOne({ _id: doc._id }, { $set: { shortId: candidate } });
      }
      console.log('[Biodata] ShortId backfill completed successfully.');
    }
  } catch (err) {
    console.warn('⚠️ [Database] ShortId backfill note:', err.message);
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
    await ensureBiodataShortIds(conn.connection.db);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
