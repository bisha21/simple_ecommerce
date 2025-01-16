import Review from "../models/Review.js";

export const createReview=async(req, res) => {
    const {review,rating}=req.body;
    const user=req.user.id;
    const product=req.params.productId;
    try {
        const newReview=await Review.create({review,rating,user,product});
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).send(error.message);
    }


}