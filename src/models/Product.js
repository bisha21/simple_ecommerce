import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        brand: String,
        category: String,
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: (val) => Math.round(val * 10) / 10,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        url: String,
        quantity: {
            type: Number,
            default: 10
        },
    },

    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
});

export default mongoose.model('Product', productSchema);
