import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true, // Associate payment with an order
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Associate payment with a user
  },
  paymentMethod: {
    type: String,
    enum: ['eSewa', 'Khalti', 'Stripe', 'PayPal'], // Add the payment methods you support
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending',
  },
  transactionId: {
    type: String, // Store the transaction ID from the payment gateway
    unique: true, // Ensure each transaction is unique
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0, // Validate that the amount is not negative
  },
  createdAt: {
    type: Date,
    default: Date.now, // Record when the payment was created
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Update this field when payment status changes
  },
});

export default mongoose.model('Payment', paymentSchema);
