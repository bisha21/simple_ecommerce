import express from "express"
import { deleteUser, getAllUser, login, logout, register } from "../controllers/authController.js"
const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.get("/user",getAllUser);
router.delete("/user/:id",deleteUser);
router.get("/logout",logout);


export default router;