const Review = require('../models/Review')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { checkPermissions } = require('../utils')

const createReview = async (req, res) => {
  const { product: productId } = req.body

  // Check if a product exists
  const isValidProduct = await Product.findOne({ _id: productId })
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`)
  }

  // Check if user already submitted
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  })

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      'Already submitted review for this product'
    )
  }

  req.body.user = req.user.userId
  const review = await Review.create(req.body)

  res.status(StatusCodes.CREATED).json({ review })
}

const getAllReviews = async (req, res) => {
  res.send('getAllReviews route')
}

const getSingleReview = async (req, res) => {
  res.send('getSingleReview route')
}

const updateReview = async (req, res) => {
  res.send('updateReview route')
}

const deleteReview = async (req, res) => {
  res.send('deleteReview route')
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
}
