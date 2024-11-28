import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Pending", "Failed"],
    default: "Pending"
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Cancelled"],
    required: true,
    default:"Pending",
  },
  items: {
    type: Number,
    min: 1,
    default: 1
  },
  purchasedAt: {
    type: Date,
    default: Date.now()
  }
});

export default mongoose.model("Order", orderSchema);
