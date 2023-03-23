const router = require('express').Router()
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require('../controllers/productController')

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')

router
  .route('/')
  .get(getAllProducts)
  .post(authenticateUser, authorizePermissions('admin', 'owner'), createProduct)

router
  .route('/uploadImage')
  .post(authenticateUser, authorizePermissions('admin', 'owner'), uploadImage)

router
  .route('/:id')
  .get(authenticateUser, getSingleProduct)
  .patch(
    authenticateUser,
    authorizePermissions('admin', 'owner'),
    updateProduct
  )
  .delete(
    authenticateUser,
    authorizePermissions('admin', 'owner'),
    deleteProduct
  )

module.exports = router