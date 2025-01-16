import express from "express";
import { createOrder, getAllOrderByUser, getAllStatus, getOrderById, getOrderGroup, updateOrder,getCheckoutSession, getAllOrder} from "../controllers/orderController.js";
import auth from "../middlewares/auth.js";
import { updateProduct } from "../controllers/productController.js";
// import auth from "../middlewares/auth.js";

const router= express.Router();
router.post("/",auth, createOrder);
router.get("/",auth,getAllOrder)
router.get("/user",auth,getAllOrderByUser);
router.get("/user/:id", auth, getOrderById);
router.put("/:id", auth, updateOrder);
router.get("/total",getOrderGroup);
router.post("/checkout-sessions/:productId",auth,getCheckoutSession);

export default router;