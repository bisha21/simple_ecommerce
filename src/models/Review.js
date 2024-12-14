import mongoose from 'mongoose';
import Product from "./Product"
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'A review must be specified.']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A user must provide a review.']
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'The review must belong to a tour.']
    }
});
reviewSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'user',
            select: '-__v -passwordChangedAt',
        },

    ])
    next();
});

reviewSchema.statics.calcAverageRating = async function (productId) {
    console.log(productId);
    const stats = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: "$product",
                nRating: {
                    $sum: 1
                },
                averageRating: { $avg: '$rating' }


            }
        }
    ])
    console.log(stats);
    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].averageRating

        })
    }
    else {
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5

        })
    }

}

reviewSchema.post('save', function () {
    this.constructor.calcAverageRating(this.product)
})
reviewSchema.index({ product: 1, user: 1 },
    {
        unique: true,
    }
)
reviewSchema.pre(/^findOneAnd/, async function (next) {
    const r = await this.findOne();
    console.log(r);
})
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    console.log(this.r);
    next()
})
reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRating(this.r.tour);

})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
