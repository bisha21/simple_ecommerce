import express from 'express';
import auth from '../middlewares/auth.js';
import { createReview } from '../controllers/reviewController.js';
const router= express.Router({mergeParams:true});
router.route('/').post(auth,createReview);
export default router