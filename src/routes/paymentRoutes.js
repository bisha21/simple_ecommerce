import express from 'express';
import { initializeKhaltiPaymentHandler } from '../controllers/paymentController.js';
const router = express.Router();
router.get('/:orderId',initializeKhaltiPaymentHandler);



export default router;