/**
 * Script to hash existing plain text passwords in the database
 * 
 * Usage: node hash_existing_passwords.js
 * 
 * This script:
 * 1. Connects to the database
 * 2. Finds all users with plain text passwords
 * 3. Hashes them using bcrypt
 * 4. Updates the database
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kidsclub',
};

async function hashExistingPasswords() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Get all users
    const [users] = await connection.execute(
      'SELECT id, email, password FROM users'
    );

    console.log(`\nFound ${users.length} users`);

    let hashedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
      if (user.password && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
        console.log(`\nHashing password for user: ${user.email} (ID: ${user.id})`);
        
        try {
          // Hash the plain text password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(user.password, salt);
          
          // Update the database
          await connection.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, user.id]
          );
          
          console.log(`✅ Password hashed successfully for ${user.email}`);
          hashedCount++;
        } catch (error) {
          console.error(`❌ Error hashing password for ${user.email}:`, error.message);
        }
      } else {
        console.log(`⏭️  Skipping ${user.email} - password already hashed`);
        skippedCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('Summary:');
    console.log(`Total users: ${users.length}`);
    console.log(`Passwords hashed: ${hashedCount}`);
    console.log(`Already hashed (skipped): ${skippedCount}`);
    console.log('='.repeat(50));

    if (hashedCount > 0) {
      console.log('\n✅ All plain text passwords have been hashed successfully!');
    } else {
      console.log('\n✅ All passwords were already hashed. No changes made.');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the script
console.log('🔐 Password Hashing Script');
console.log('='.repeat(50));
hashExistingPasswords()
  .then(() => {
    console.log('\n✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

