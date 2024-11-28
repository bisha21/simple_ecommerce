import orderServices from "../services/orderServices.js";

const createOrder = async (req, res) => {
  const input = req.body;
  const user = req.user;

  try {

    const order = await orderServices.createOrder({ userId: user.id, ...input });
    res.status(201).json(order);

  }
  catch (error) {
    res.status(500).send(error.message)
  }
}


const getAllOrderByUser = async (req, res) => {
  const user = req.user; // Assuming you get the user object from middleware like passport.js or JWT auth

  try {
    const orders = await orderServices.getAllOrdersByUser(user.id);

    // Respond with the orders, including product details
    res.json(orders);
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

    if (!order) return res.status(404).send("Order not found!");

    if (order.createdBy != user.id && !user.roles.includes("Admin")) {
      return res.status(403).send("Access Denied.");
    }

    const updatedOrder = await orderServices.updateOrder(id, data);

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

export { createOrder, getAllOrderByUser, getAllStatus, getOrderById, updateOrder, getOrderGroup }