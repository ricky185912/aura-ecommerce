import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Create new order
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, shippingAddress, phone, notes, totalAmount } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: 'Shipping address required' }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    // Create order
    const [order] = await sql`
      INSERT INTO orders (order_number, user_id, user_name, user_email, total_amount, shipping_address, phone, notes)
      VALUES (${orderNumber}, ${user.id}, ${user.name}, ${user.email}, ${totalAmount}, ${shippingAddress}, ${phone || null}, ${notes || null})
      RETURNING *
    `;

    // Create order items - Get seller_id from the product
    for (const item of items) {
      // First, get the product's seller_id
      const productResult = await sql`
        SELECT seller_id FROM products WHERE id = ${item.id}
      `;
      
      const sellerId = productResult.length > 0 ? productResult[0].seller_id : 1;
      
      await sql`
        INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price, seller_id, status)
        VALUES (${order.id}, ${item.id}, ${item.name}, ${item.image}, ${item.quantity}, ${item.price}, ${sellerId}, 'pending')
      `;
    }

    return NextResponse.json({ 
      success: true, 
      order: order,
      message: 'Order placed successfully!' 
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// Get user's orders
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await sql`
      SELECT o.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'product_name', oi.product_name,
              'product_image', oi.product_image,
              'quantity', oi.quantity,
              'price', oi.price,
              'status', oi.status,
              'tracking_number', oi.tracking_number,
              'estimated_delivery', oi.estimated_delivery
            ) ORDER BY oi.id
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ${user.id}
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;

    // Always return an array, even if empty
    return NextResponse.json(orders || []);

  } catch (error) {
    console.error('Error fetching orders:', error);
    // Return empty array instead of error to prevent JSON parsing issues
    return NextResponse.json([]);
  }
}