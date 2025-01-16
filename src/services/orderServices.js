import mongoose from "mongoose";
import Order from "../models/Order.js";

const createOrder = async (data) => {
  return await Order.create(data);
};
const getAllOrder = async (days) => {
  const day = parseInt(days, 10) || 7; // Ensure days is a valid integer, default to 7
  console.log("Services order", day);

  const date = new Date();
  // Calculate the start date for the number of days specified
  const startDate = new Date(date.getTime() - day * 24 * 60 * 60 * 1000); // Convert days to milliseconds

  console.log("HI", startDate);

  try {
    // If 'days' is provided, show orders from the last 'n' days. If not, default to 7 days.
    const query = { purchasedAt: { $gte: startDate } };  // Use `$gte` to get orders from the past 'n' days
    return await Order.find(query)
      .populate({
        path: "productId",
        select: "name price",
      })
      .populate({
        path: "userId",
        select: "name",
      });
  } catch (error) {
    throw new Error("Error fetching orders: " + error.message); // Throw error for the controller to handle
  }
};


const getAllOrdersByUser = async (userId) => {
  const result = await Order.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },

    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },

    { $unwind: "$productDetails" },
  ]);

  return result;
};

const getOrderById = async (id) => {
  const result = await Order.findById(id); // Fetch the order by its _id
  return result;
};

const getStatus = async () => {
  try {
    // Fetch distinct values of the 'status' field from the database
    const statusEnums = await Order.distinct("status");
    return statusEnums;
  } catch (error) {
    console.error("Error fetching distinct statuses:", error);
    throw error;
  }
};


const updateOrder = async (id, data) => {
  return await Order.findByIdAndUpdate(id, data);


}


const getTotalAmountByStatus = async () => {

  const result = await Order.aggregate([
    {
      $lookup: {
        from: "products", // Collection name for products
        localField: "productId", // Field in orders schema
        foreignField: "_id", // Field in products schema
        as: "productDetails"
      }
    },
    {
      $unwind: "$productDetails" // Flatten the productDetails array
    },
    {
      $group: {
        _id: "$status", // Group by the "status" field
        totalAmount: {
          $sum: { $multiply: ["$items", "$productDetails.price"] } // Calculate total amount
        },
        orders: { $push: "$$ROOT" }
      }
    },
    {
      $project: {
        status: "$_id",
        totalAmount: 1,
        // orders: 1
      }
    }
  ]);
  return result;
};






export default { createOrder, getAllOrdersByUser, getStatus, getOrderById, updateOrder, getTotalAmountByStatus, getAllOrder };

