import { NextResponse, NextRequest } from 'next/server';
import Order from '@/models/Order';
import Payment from '@/models/Payments';
import { UserPayload, withAuth } from '@/lib/withAuth';

export const GET = withAuth(
  async (req: NextRequest, user: UserPayload) => {
    try {
      // 🔹 Extract order id from URL
      const id = req.nextUrl.pathname.split('/').pop();

      if (!id) {
        return NextResponse.json(
          { message: 'Order id missing' },
          { status: 400 }
        );
      }

      // 🔹 Fetch order (ownership enforced)
      const order = await Order.findOne({
        _id: id,
        userId: user.id,
      })
        .populate({ path: 'items.productId' })
        .populate('userId')
        .lean();

      if (!order) {
        return NextResponse.json(
          { message: 'Order not found' },
          { status: 404 }
        );
      }

      // 🔹 Fetch latest payment for this order
      const payment = await Payment.findOne({
        orderId: order._id.toString(),
      })
        .sort({ createdAt: -1 })
        .lean();

      // 🔹 Return combined response
      return NextResponse.json({
        order,
        payment, // may be null if not paid yet
      });

    } catch (error: any) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
  }
);
