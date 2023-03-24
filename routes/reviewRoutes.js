const router = require('express').Router()
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController')
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')

router.route('/').get(getAllReviews)

router
  .route('/:id')
  .get(getSingleReview)
  .post(authenticateUser, createReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview)

module.exports = router
