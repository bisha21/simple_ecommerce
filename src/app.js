import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import products from "./routes/products.js";
import auth from "./routes/auth.js";
import order from "./routes/order.js";
import authMiddleware from "./middlewares/auth.js";
import connectDB from "./database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import productService from "./services/productService.js";

const app = express();

dotenv.config();

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.use(cookieParser());

app.use(
  cors({
    // origin: "http://localhost:5173",

    origin: "http://localhost:5000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


const PORT = process.env.PORT;

app.get("/", (req, res) => {
  // JSON => JavaScript Object Notation
  res.json({
    appName: "nodejs-20240823",
    version: process.env.VERSION,
    port: 3000
  });
});

app.use("/api/products", products);
app.use("/api/auth", auth);
app.use("/api/order", order);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}...`);
});

// HTTP Methods
/** CRUD
 * Read = GET /products
 * Write (Create) = POST /products
 * Update = PUT /products/:id
 * Delete = DELETE /products/:id
 */

// MVC => Model, View, Controller