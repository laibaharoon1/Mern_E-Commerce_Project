const express = require("express");
const { upload } = require("../../helpers/cloudinary");
const { authMiddleware, requireAdmin } = require("../../controllers/auth/auth-middleware");
const { 
    handleImageUpload,
    addProduct,
    fetchAllProducts,
    editProduct,
    deleteProduct, } = require("../../controllers/admin/product-controller.js")
const router = express.Router();

router.use(authMiddleware, requireAdmin);
router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post('/add', addProduct)
router.put('/edit/:id', editProduct)
router.delete('/delete/:id', deleteProduct)
router.get('/get', fetchAllProducts)


module.exports = router;
