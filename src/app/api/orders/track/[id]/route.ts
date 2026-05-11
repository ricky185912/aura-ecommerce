import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const orderItemId = parseInt(id);

    // Get order item details
    const [orderItem] = await sql`
      SELECT 
        oi.*,
        o.order_number,
        o.user_name,
        o.user_email,
        o.shipping_address,
        o.created_at as order_date
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.id = ${orderItemId} AND (o.user_id = ${user.id} OR oi.seller_id = ${user.id})
    `;

    if (!orderItem) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get status history
    const history = await sql`
      SELECT * FROM order_status_history 
      WHERE order_item_id = ${orderItemId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ order: orderItem, history });

  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 });
  }
}