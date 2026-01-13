import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Order from '@/models/Order';
import { connectDB } from '@/lib/db';
import Payment from '@/models/Payments';

export async function POST(request: Request) {
  await connectDB();

  try {
    // 1️⃣ Parse Sadad POST data
    const formData = await request.formData();
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    console.log('🌐 Sadad Callback (NO WEBHOOK MODE):', data);

    const orderId = data.ORDERID || data.orderId;

    if (!orderId) {
      return NextResponse.redirect(
        new URL('/payment/failed', request.url)
      );
    }

    // 2️⃣ Verify checksum
    const receivedChecksum = data.checksumhash;
    if (!receivedChecksum) {
      return NextResponse.redirect(
        new URL(`/payment/failed?orderId=${orderId}`, request.url)
      );
    }

    delete data.checksumhash;

    const sortedKeys = Object.keys(data).sort();
    let checksumString = process.env.SADAD_SECRET_KEY!;

    for (const key of sortedKeys) {
      checksumString += data[key];
    }

    const generatedChecksum = crypto
      .createHash('sha256')
      .update(checksumString)
      .digest('hex');

    if (generatedChecksum !== receivedChecksum) {
      await Payment.create({
        orderId,
        amount: Number(data.TXNAMOUNT || 0),
        status: 'INVALID_CHECKSUM',
        gateway: 'SADAD',
        rawPayload: data,
      });

      return NextResponse.redirect(
        new URL(`/payment/failed?orderId=${orderId}`, request.url)
      );
    }

    // 3️⃣ Prevent duplicate processing
    const alreadyProcessed = await Payment.findOne({
      transactionNumber: data.transaction_number,
    });

    if (alreadyProcessed) {
      return NextResponse.redirect(
        new URL(`/payment/success?orderId=${orderId}`, request.url)
      );
    }

    // 4️⃣ SUCCESS CASE
    if (data.STATUS === 'TXN_SUCCESS' && data.RESPCODE === '1') {
      await Payment.create({
        orderId,
        websiteRefNo: data.website_ref_no,
        transactionNumber: data.transaction_number,
        amount: Number(data.TXNAMOUNT),
        status: 'SUCCESS',
        responseCode: data.RESPCODE,
        responseMessage: data.RESPMSG,
        gateway: 'SADAD',
        rawPayload: data,
      });

      await Order.findOneAndUpdate(
        { orderId },
        {
          paymentStatus: 'PAID',
          transactionNumber: data.transaction_number,
        }
      );

      return NextResponse.redirect(
        new URL(`/payment/success?orderId=${orderId}`, request.url)
      );
    }

    // 5️⃣ FAILED CASE
    await Payment.create({
      orderId,
      websiteRefNo: data.website_ref_no,
      transactionNumber: data.transaction_number,
      amount: Number(data.TXNAMOUNT),
      status: 'FAILED',
      responseCode: data.RESPCODE,
      responseMessage: data.RESPMSG,
      gateway: 'SADAD',
      rawPayload: data,
    });

    await Order.findOneAndUpdate(
      { orderId },
      { paymentStatus: 'FAILED' }
    );

    return NextResponse.redirect(
      new URL(`/payment/failed?orderId=${orderId}`, request.url)
    );

  } catch (error) {
    console.error('🔥 Sadad Callback Error:', error);
    return NextResponse.redirect(
      new URL('/payment/failed', request.url)
    );
  }
}
