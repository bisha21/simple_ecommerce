import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getCategories,
  getProductById,
  getTotalProducts,
  updateProduct,
} from "../controllers/productController.js";
import auth from "../middlewares/auth.js";
import roleBasedAuth from "../middlewares/roleBasedAuth.js";

const router = express.Router();

/**
 * GET
 * /api/products/categories
 * Get all product categories
 * No authentication or authorization required
 */
router.get("/categories", getCategories);
router.get("/totalProducts",getTotalProducts);



/**
 * GET
 * /api/products
 * Get all products
 * No authentication or authorization required
 */
router.get("/", getAllProducts);

/**
 * GET
 * /api/products/:id
 * Get product by id
 * No authentication or authorization required
 */
router.get("/:id", getProductById);

/**
 * POST
 * /api/products
 * Add a product
 * Authentication is required but not authorization
 */
router.post("/",auth, addProduct);

/**
 * PUT
 * /api/products/:id
 * Update product
 * Authentication and authorization are required
 * Admin can update product
 * User who created the product can update it.
 */
router.put("/:id", [auth, roleBasedAuth("Admin")], updateProduct);

/**
 * DELETE
 * /api/products/:id
 * Delete a product
 * Authentication and authorization are required
 * Only admin can delete product
 */
router.delete("/:id", [auth, roleBasedAuth("Admin")], deleteProduct);


export default router;

// FB group
// User can see group posts
// Moderator can create posts or edit or delete only self created post
// Admin can only create,update and delete post