require('dotenv').config();
const { connectDB } = require('../config/db');

async function cleanDatabase() {
  try {
    const conn = await connectDB();
    console.log('Connected to database:', conn.name);

    const collections = await conn.db.listCollections().toArray();
    console.log(`Found ${collections.length} collection(s) in database "${conn.name}":`, collections.map(c => c.name));

    if (collections.length === 0) {
      console.log('No collections found. Database is completely clean.');
    } else {
      for (const col of collections) {
        console.log(`Dropping collection: ${col.name}...`);
        await conn.db.dropCollection(col.name);
      }
      console.log('Successfully dropped all existing collections and data from the database!');
    }

    console.log('Database clean-up finished successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error cleaning database:', err);
    process.exit(1);
  }
}

cleanDatabase();
