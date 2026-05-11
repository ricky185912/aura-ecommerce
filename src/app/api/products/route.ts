import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET all products (public)
export async function GET() {
  try {
    const products = await sql`
      SELECT p.*, u.name as seller_name 
      FROM products p 
      LEFT JOIN users u ON p.seller_id = u.id 
      ORDER BY p.created_at DESC
    `;
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST new product (seller only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { name, description, price, originalPrice, category, images, stock, isNew } = await request.json();
    
    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // CRITICAL: Use the logged-in user's ID as seller_id
    const result = await sql`
      INSERT INTO products (name, description, price, original_price, category, images, stock, is_new, seller_id)
      VALUES (${name}, ${description || ''}, ${price}, ${originalPrice || null}, ${category}, ${images || []}, ${stock || 0}, ${isNew || false}, ${user.id})
      RETURNING *
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}