import productService from "../services/productService.js";

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts(req.query);

    res.json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductById = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await productService.getProductById(id);

    if (!product) return res.status(404).send("Product not found!");

    res.json(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const addProduct = async (req, res) => {
  const data = req.body;
  const userId = req.user.id;

  if (!data.name) return res.status(422).send("Product name is required.");
  if (!data.price) return res.status(422).send("Product price is required.");

  try {
    const createdProduct = await productService.createProduct(data, userId);

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const user = req.user;

  try {
    const product = await productService.getProductById(id);

    if (!product) return res.status(404).send("Product not found!");

    if (product.createdBy != user.id && !user.roles.includes("Admin")) {
      return res.status(403).send("Access Denied.");
    }

    const updatedProduct = await productService.updateProduct(id, data);

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await productService.getProductById(id);

    if (!product) return res.status(404).send("Product not found!");

    await productService.deleteProduct(id);

    res.send(`Product with id ${id} deleted successfully`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await productService.getCategories();

    res.json(categories);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const getTotalProducts = async (req, res) => {
  try{
    const totalProducts= await productService.getTotalProduct();
    res.json(totalProducts);
  }
  catch(errror)
  {
    res.status(500).send(errror.message);
  }


}



export {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getTotalProducts
};