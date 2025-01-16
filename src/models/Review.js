import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'A review must be specified.'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A user must provide a review.'],
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'The review must belong to a product.'],
    },
});

reviewSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'user',
            select: 'name',
        },
    ]);
    next();
});

reviewSchema.statics.calcAverageRating = async function (productId) {
    const stats = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: '$product',
                nRating: { $sum: 1 },
                averageRating: { $avg: '$rating' },
            },
        },
    ]);

    if (stats.length > 0) {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].averageRating,
        });
    } else {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            ratingsQuantity: 0,
            ratingsAverage: 4,
        });
    }
};

reviewSchema.post('save', function () {
    this.constructor.calcAverageRating(this.product);
});

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    if (this.r) {
        await this.r.constructor.calcAverageRating(this.r.product);
    }
});

export default mongoose.model('Review', reviewSchema);
