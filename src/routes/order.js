import express from "express";
import { createOrder, getAllOrderByUser, getAllStatus, getOrderById, getOrderGroup, updateOrder} from "../controllers/orderController.js";
import auth from "../middlewares/auth.js";
import { updateProduct } from "../controllers/productController.js";
// import auth from "../middlewares/auth.js";

const router= express.Router();
router.post("/",auth, createOrder);
router.get("/user",auth,getAllOrderByUser);
router.get("/user/:id", auth, getOrderById);
router.put("/:id", auth, updateOrder);
router.get("/user/total",getOrderGroup);

export default router;