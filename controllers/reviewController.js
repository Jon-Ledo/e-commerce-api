const Review = require('../models/Review')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const createReview = async (req, res) => {
  res.send('create reviw route')
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
