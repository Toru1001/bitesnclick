import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeText } from '@/lib/utils/sanitize';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cartId, message, address, paymentMethod, payment_img, voucherCode } = body;

    if (!cartId) {
      return NextResponse.json({ error: 'Missing cartId' }, { status: 400 });
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const allowedMethods = ['Cash On Delivery', 'GCASH'];
    if (!paymentMethod || !allowedMethods.includes(paymentMethod)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }

    const safeMessage = safeText(message).slice(0, 500);
    const safeAddress = safeText(address).slice(0, 500);

    // Validate voucher if present
    let voucherId: number | null = null;
    if (voucherCode) {
      const { data: voucherData, error: voucherError } = await supabase
        .from('vouchers')
        .select('voucherid, status, start_date, end_date')
        .eq('code', voucherCode)
        .single();

      if (voucherError || !voucherData) {
        return NextResponse.json({ error: 'Invalid voucher code' }, { status: 400 });
      }

      const now = new Date();
      const startDate = new Date(voucherData.start_date);
      const expiryDate = new Date(voucherData.end_date);

      if (now < startDate || expiryDate < now || voucherData.status !== 'available') {
        return NextResponse.json({ error: 'Voucher not valid' }, { status: 400 });
      }

      voucherId = voucherData.voucherid;
    }

    // Fetch cart items and build orderdetails
    const { data: cartItems, error: cartItemsError } = await supabase
      .from('cart_items')
      .select('*, product:productid(price)')
      .eq('cartid', cartId);

    if (cartItemsError) {
      return NextResponse.json({ error: 'Failed to fetch cart items' }, { status: 500 });
    }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Compute final price (simple logic matching client)
    const subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.total_price || 0), 0);
    const deliveryFee = 40;
    let finalPrice = subtotal === 0 ? 0 : subtotal + deliveryFee;

    if (voucherId) {
      const { data: voucher } = await supabase.from('vouchers').select('*').eq('voucherid', voucherId).single();
      if (voucher) {
        const discountAmount = (finalPrice * (voucher.percent || 0)) / 100;
        finalPrice = finalPrice - discountAmount;
      }
    }

    // Insert order
    const orderData: any = {
      order_status: 'Pending',
      order_date: new Date().toISOString(),
      order_price: finalPrice.toFixed(2),
      message: safeMessage,
      delivery_address: safeAddress,
      customerid: user.id,
      voucherid: voucherId,
      paymentMethod,
      payment_img: payment_img ?? null,
    };

    const { data: orderInsertData, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select('orderid')
      .single();

    if (orderError || !orderInsertData) {
      return NextResponse.json({ error: 'Failed to insert order' }, { status: 500 });
    }

    const orderId = orderInsertData.orderid;

    // Insert order details
    const orderDetailsData: any[] = [];
    for (const item of cartItems) {
      // Determine product price, prefer discount if available server-side
      const { data: discountData } = await supabase
        .from('discount')
        .select('newprice')
        .eq('productid', item.productid)
        .lte('start_date', new Date().toISOString())
        .gte('end_date', new Date().toISOString())
        .single();

      const prodPrice = discountData?.newprice ?? item.product?.price ?? 0;

      orderDetailsData.push({
        orderid: orderId,
        productid: item.productid,
        price: item.total_price,
        quantity: item.quantity,
        prod_price: prodPrice,
      });
    }

    if (orderDetailsData.length > 0) {
      const { error: orderDetailsError } = await supabase.from('orderdetails').insert(orderDetailsData);
      if (orderDetailsError) {
        return NextResponse.json({ error: 'Failed to insert order details' }, { status: 500 });
      }
    }

    // Delete cart items
    const { error: deleteCartItemsError } = await supabase.from('cart_items').delete().eq('cartid', cartId);
    if (deleteCartItemsError) {
      return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
    }

    // Mark voucher used
    if (voucherId) {
      await supabase.from('vouchers').update({ status: 'used' }).eq('voucherid', voucherId);
    }

    return NextResponse.json({ orderId }, { status: 200 });
  } catch (err) {
    console.error('Order API error:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
