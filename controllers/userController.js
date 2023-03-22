const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const customError = require('../errors')

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
  res.send('show current user')
}

const updateUser = async (req, res) => {
  res.send('update user')
}

const updateUserPassword = async (req, res) => {
  res.send('update user password')
}

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
}
