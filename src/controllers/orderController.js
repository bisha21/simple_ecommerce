import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import orderServices from "../services/orderServices.js";
import Stripe from "stripe";

const stripe = new Stripe('sk_test_51QfNZyKaOtF0Bun2kINg8AuG2gizCx3nz7bYQv8jAwTmCRUBIkCsm4nKjUIT79Azqdj8S8ZadOZSpmz50zyWLCaU00IQliZuJK');
const createOrder = async (req, res) => {
  const input = req.body;
  const user = req.user;


  try {

    const order = await orderServices.createOrder({ userId: user.id, ...input });
    console.log("Order",order);
    res.status(201).json(order);

  }
  catch (error) {
    res.status(500).send(error.message)
  }
}

const getAllOrder = async (req, res) => {
  const { days } = req.query; // Get days from query params
  console.log(req.query);

  try {
    const orders = await orderServices.getAllOrder(days); // Call service function
    res.json(orders); // Send the orders as JSON response
  } catch (error) {
    res.status(500).send({ error: error.message }); // Handle and send error response
  }
};


const getAllOrderByUser = async (req, res) => {
  const user = req.user; // Assuming you get the user object from middleware like passport.js or JWT auth

  try {
    const orders = await orderServices.getAllOrdersByUser();

    // Respond with the orders, including product details
    res.json({
      total: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getAllStatus = async (req, res) => {
  try {
    const stat = await orderServices.getStatus(); // Fetch status enums from the service
    console.log(stat);
    res.json(stat);
  } catch (error) {
    console.error("Error fetching status:", error);
    res.status(500).send(error.message);
  }
};

const getOrderById = async (req, res) => {
  const id = req.params.id; // Extract the order ID
  try {
    const order = await orderServices.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
};


const updateOrder = async (req, res) => {
  const id = req.params.id
  const data = req.body;
  const user = req.user;

  try {
    const order = await orderServices.getOrderById(id);

    if (!order) return res.status(400).send("Order not found!");

    if (order.createdBy != user.id && !user.roles.includes("Admin")) {
      return res.status(403).send("Access Denied.");
    }

    const updatedOrder = await orderServices.updateOrder(id, data);
    
    console.log(updatedOrder)

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).send(error.message);
  }
}



const getOrderGroup = async (req, res) => {
  try {
    const result = await orderServices.getTotalAmountByStatus();
    res.status(200).json(result);
  }
  catch (error) {
    console.error(error); // Log the error for debugging purposes

    res.status(500).send(error.message);
  }
}
// const getCheckoutSession = async (req, res) => {
//   try {
//     // Fetch the product by ID
//     const product = await Product.findById(req.params.productId);

//     // Check if the product exists
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Ensure the product price is valid
//     if (!product.price || typeof product.price !== 'number') {
//       return res.status(400).json({ message: 'Invalid product price' });
//     }

//     // Check if the user email is available
//     if (!req.user || !req.user.email) {
//       return res.status(400).json({ message: 'User email is required for checkout' });
//     }

//     // Create a Stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       success_url: 'http://localhost:3000/success',
//       cancel_url: 'http://localhost:3000/cancel',
//       customer_email: req.user.email, // User's email from req.user
//       client_reference_id: req.params.productId, // Reference to the product ID
//       mode: 'payment', // Add this line to specify the mode
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: product.name,
//             },
//             unit_amount: product.price * 100, // Convert price to cents
//           },
//           quantity: product.quantity,
//         },
//       ],
//     });
    
//     if (session) {
//       try {
//         // Update the paymentStatus of the order
//         await Order.findByIdAndUpdate(
//           req.params.productId, // The ID of the product (or order in this case)
//           { paymentStatus: "Paid" }, // The fields to update
//           { new: true } // Options: Return the updated document
//         );
    
//         console.log("Order payment status updated successfully");
//       } catch (error) {
//         console.error("Error updating payment status:", error.message);
//       }
//     }
    
    
//     // Respond with session details
//     res.status(200).json({
//       status: 'success',
//       session,
//     });
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     res.status(500).json({ message: 'Failed to create checkout session', error: error.message });
//   }
// };
// const getCheckoutSession = async (req, res) => {
//   try {
//     const { quantity } = req.body; // Get quantity from the request body
//     if (!quantity || quantity < 1) {
//       return res.status(400).json({ message: 'Invalid quantity' });
//     }

//     // Fetch the product by ID
//     const product = await Product.findById(req.params.productId);
//     const order = await Order.findOne({
//       productId: new mongoose.Types.ObjectId(req.params.productId),
//       userId: new mongoose.Types.ObjectId(req.user.id),
//     });
//     console.log(order);
    
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     if (!product.price || typeof product.price !== 'number') {
//       return res.status(400).json({ message: 'Invalid product price' });
//     }

//     if (!req.user || !req.user.email) {
//       return res.status(400).json({ message: 'User email is required for checkout' });
//     }

//     // Create a Stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       success_url: 'http://localhost:5000/shopping-cart',
//       cancel_url: 'http://localhost:5000/shopping-cart',
//       customer_email: req.user.email,
//       client_reference_id: req.params.productId,
//       mode: 'payment',
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: product.name,
//             },
//             unit_amount: product.price * 100,
//           },
//           quantity: quantity, // Use the provided quantity
//         },
//       ],
//     });
//     if(session)
//     {
//       order.paymentStatus= 'Paid';
//       await order.save();

//     }

//     res.status(200).json({
//       status: 'success',
//       session,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to create checkout session', error: error.message });
//   }
// };
const getCheckoutSession = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.productId) || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const product = await Product.findById(req.params.productId);
    const order = await Order.findOne({
      productId: new mongoose.Types.ObjectId(req.params.productId),
      userId: new mongoose.Types.ObjectId(req.user.id),
    });
    console.log("Product ID:", req.params.productId);
    console.log("User ID:", req.user.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!req.user?.email) return res.status(400).json({ message: 'User email is required for checkout' });
    
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: process.env.STRIPE_SUCCESS_URL || 'http://localhost:5000/shopping-cart',
      cancel_url: process.env.STRIPE_CANCEL_URL || 'http://localhost:5000/shopping-cart',
      customer_email: req.user.email,
      client_reference_id: req.params.productId,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: product.name },
            unit_amount: product.price * 100,
          },
          quantity,
        },
      ],
    });


    if(session) {
      order.paymentStatus = 'Paid';
      await order.save();
    }

    res.status(200).json({ status: 'success', session });
  } catch (error) {
    console.error('Error in checkout session:', error.stack || error.message);
    res.status(500).json({ message: 'Failed to create checkout session', error: error.message });
  }
};


export { createOrder, getAllOrderByUser, getAllStatus, getOrderById, updateOrder, getOrderGroup,getCheckoutSession,getAllOrder }