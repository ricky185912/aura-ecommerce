import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

interface OrderItem {
  id: number;
  order_number: string;
  product_name: string;
  product_images: string[];
  quantity: number;
  price: number;
  status: string;
  tracking_number: string | null;
  estimated_delivery: string | null;
  user_name: string;
  user_email: string;
  shipping_address: string;
  phone: string | null;
  order_date: Date;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let orders: OrderItem[];
    
    if (user.role === 'admin') {
      // Admin sees all orders
      const result = await sql`
        SELECT 
          oi.*,
          o.order_number,
          o.user_name,
          o.user_email,
          o.shipping_address,
          o.phone,
          o.created_at as order_date,
          p.name as product_name,
          p.images as product_images,
          p.price as product_price
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        ORDER BY oi.created_at DESC
      `;
      orders = result as unknown as OrderItem[];
    } else {
      // Seller only sees their own products' orders
      const result = await sql`
        SELECT 
          oi.*,
          o.order_number,
          o.user_name,
          o.user_email,
          o.shipping_address,
          o.phone,
          o.created_at as order_date,
          p.name as product_name,
          p.images as product_images,
          p.price as product_price
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE oi.seller_id = ${user.id}
        ORDER BY oi.created_at DESC
      `;
      orders = result as unknown as OrderItem[];
    }

    // Transform the data to match what the frontend expects
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      order_number: order.order_number,
      product_name: order.product_name,
      product_images: order.product_images || [],
      quantity: order.quantity,
      price: order.price,
      status: order.status || 'pending',
      tracking_number: order.tracking_number,
      estimated_delivery: order.estimated_delivery,
      user_name: order.user_name,
      user_email: order.user_email,
      shipping_address: order.shipping_address,
      phone: order.phone,
      created_at: order.order_date,
    }));

    return NextResponse.json(transformedOrders);

  } catch (error) {
    console.error('Error fetching seller orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}