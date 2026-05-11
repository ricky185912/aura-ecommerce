import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const sql = neon(process.env.DATABASE_URL);

// Initialize database tables
export async function initDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('Users table created or already exists');
    
    // Check if admin exists
    const existingAdmin = await sql`SELECT * FROM users WHERE email = 'admin@aura.com'`;
    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await sql`
        INSERT INTO users (email, password, name, role) 
        VALUES ('admin@aura.com', ${hashedPassword}, 'Admin User', 'admin')
      `;
      console.log('Admin user created');
    }
    
    // Check if seller exists
    const existingSeller = await sql`SELECT * FROM users WHERE email = 'seller@aura.com'`;
    if (existingSeller.length === 0) {
      const hashedPassword = await bcrypt.hash('seller123', 10);
      await sql`
        INSERT INTO users (email, password, name, role) 
        VALUES ('seller@aura.com', ${hashedPassword}, 'Seller User', 'seller')
      `;
      console.log('Seller user created');
    }
    
    // Check if regular user exists
    const existingUser = await sql`SELECT * FROM users WHERE email = 'user@aura.com'`;
    if (existingUser.length === 0) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      await sql`
        INSERT INTO users (email, password, name, role) 
        VALUES ('user@aura.com', ${hashedPassword}, 'Regular User', 'user')
      `;
      console.log('Regular user created');
    }
    
    return { success: true, message: 'Database initialized successfully' };
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}