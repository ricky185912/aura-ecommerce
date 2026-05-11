import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status, trackingNumber, estimatedDelivery } = await request.json();

    // Update order item status
    await sql`
      UPDATE order_items 
      SET 
        status = ${status},
        tracking_number = ${trackingNumber || null},
        estimated_delivery = ${estimatedDelivery || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(id)}
    `;

    // Add status history
    await sql`
      INSERT INTO order_status_history (order_item_id, status, note)
      VALUES (${parseInt(id)}, ${status}, ${'Status updated by seller'})
    `;

    return NextResponse.json({ success: true, message: 'Order status updated' });

  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}