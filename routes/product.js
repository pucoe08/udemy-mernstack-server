import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
import { addCategory, addProductImage, createProduct, deleteCategory, deleteProduct, deleteProductImage, getAdminProducts, getAllCategories, getAllproducts, getProductDetails, updateProduct } from "../controllers/product.js";

const router = express.Router();

router.get("/all", getAllproducts);
router.get("/admin", isAuthenticated, isAdmin,getAdminProducts);

router.post("/new", isAuthenticated, isAdmin, singleUpload, createProduct);

router.route("/single/:id")
    .get(getProductDetails)
    .put(isAuthenticated, isAdmin, updateProduct)
    .delete(isAuthenticated, isAdmin, deleteProduct);

router.route("/images/:id")
    .post(isAuthenticated, isAdmin, singleUpload, addProductImage)
    .delete(isAuthenticated, isAdmin, deleteProductImage);

// Category Routes
router.post("/category", isAuthenticated, isAdmin, addCategory);
router.get("/categories", getAllCategories);
router.delete("/category/:id", isAuthenticated, isAdmin, deleteCategory);

export default router;

