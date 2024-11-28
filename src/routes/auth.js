import express from "express"
import { deleteUser, getAllUser, login, register } from "../controllers/authController.js"
const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.get("/user",getAllUser);
router.delete("/user/:id",deleteUser);


export default router;