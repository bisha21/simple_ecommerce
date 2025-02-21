import Product from "../models/Product.js";

const getAllProducts = async (query) => {
  const limit = query?.limit || 10;
  const sort = query?.sort ? JSON.parse(query.sort) : {};
  const filters = query?.filters ? JSON.parse(query.filters) : {};
  const page = query?.page || 1;
  const offset = (page - 1) * limit;
  const customQuery = Object.entries(filters).reduce((acc, [key, value]) => {
    const result = { ...acc, [key]: new RegExp(value, "i") };
    return result;
  }, {});

  return await Product.find(customQuery).limit(limit).sort(sort).skip(offset);
};

const getProductById = async (id) => {
  return await Product.findById(id).populate({
    path: 'reviews',
    select: 'review rating ', // Include only the desired fields
  })
};

const createProduct = async (data, userId) => {
  return await Product.create({ ...data, createdBy: userId });
};

const updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data);
};

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

const getCategories = async () => {
  return await Product.distinct("category");
};

const getTotalProduct = async () => {
  return await Product.countDocuments();
};


export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategories,
  getTotalProduct,
};