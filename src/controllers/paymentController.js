import Order from '../models/Order.js';
import Payments from '../models/Paymemts.js';
import { initializeKhaltiPayment } from '../utils.js/Khalti.js';

export const initializeKhaltiPaymentHandler = async (req, res, next) => {
    const { orderId } = req.params;

    try {
        // 1️⃣ Fetch the order with product details
        const order = await Order.findById(orderId).populate('productId');

        if (!order) return next(new AppError('Order not found', 404));
        if (order.paymentStatus === 'Paid') {
            return res.status(400).json({ status: 'fail', message: 'Payment already completed.' });
        }

        // 2️⃣ Calculate the amount in paisa
        const amountInPaisa = order.productId.price * order.items * 100;

        // 3️⃣ Initialize Khalti payment
        const paymentInitiate = await initializeKhaltiPayment({
            amount: amountInPaisa,
            purchase_order_id: String(order._id),
            purchase_order_name: `Order #${orderId}`,
            return_url: process.env.KHALTI_RETURN_URL || 'https://khalti.com/api/v2/payment/verify/',
            website_url: process.env.WEBSITE_URL || 'http://localhost:5173/',
        });

        if (!paymentInitiate?.pidx || !paymentInitiate?.payment_url) {
            return next(new AppError('Failed to initiate payment. Missing pidx or payment_url.', 400));
        }
        if (paymentInitiate) {
            order.paymentStatus = 'Paid';
            order.save();
        }

        // 4️⃣ Create and save the Payment with required fields
        const payment = new Payments({
            transactionId: paymentInitiate.pidx,
            pidx: paymentInitiate.pidx,
            totalAmount: order.productId.price * order.items, // total in rupees
            amount: amountInPaisa, // amount in paisa (optional if not in schema)
            paymentGateway: 'khalti',
            status: 'pending',
            description: `Payment for order #${orderId}`,
            productId: order.productId._id     // Added orderId
        });

        await payment.save();

        res.status(200).json({
            status: 'success',
            message: 'Payment initiated successfully.',
            payment_url: paymentInitiate.payment_url,
            payment,
        });
    } catch (err) {
        console.error('Error in Khalti payment:', err.stack || err.message);
        res.status(500).json({ message: 'Failed to initiate payment', error: err.message });
    }
};
