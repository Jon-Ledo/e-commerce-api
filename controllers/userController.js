const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const customError = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils')

const getAllUsers = async (req, res) => {
  // console.log(req.user) -> comes from middlewareauthentication
  const users = await User.find({ role: 'user' }).select('-password')

  res.status(StatusCodes.OK).json({ users })
}

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password')

  if (!user) {
    throw new customError.NotFoundError(
      `No user found with id : ${req.params.id}`
    )
  }

  res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

const updateUser = async (req, res) => {
  const { name, email } = req.body
  console.log(req.user)
  if (!name || !email) {
    throw new customError.BadRequestError('Please provide all values')
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { name, email },
    { new: true, runValidators: true }
  )

  // let the front end know that the name has changed right away
  const tokenUser = await createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.OK).json({ msg: 'user info updated' })
}

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    throw new customError.BadRequestError('Please provide both values')
  }

  const user = await User.findOne({ _id: req.user.userId })

  const isPasswordCorrect = await user.comparePassword(oldPassword)
  if (!isPasswordCorrect) {
    throw new customError.UnauthenticatedError('Invalid credentials')
  }

  user.password = newPassword
  await user.save()
  res.status(StatusCodes.OK).json({ msg: 'Success! Password updated' })
}

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
}
