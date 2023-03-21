const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { attachCookiesToResponse } = require('../utils')

const register = async (req, res) => {
  const { email, name, password } = req.body

  // check if email exists
  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('email already exists')
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? 'admin' : 'user'

  // create new user
  const newUser = await User.create({ email, name, password, role })

  // issue token upon creation
  const tokenUser = {
    name: newUser.name,
    userID: newUser._id,
    role: newUser.role,
  }

  // attach cookie to response using JWT functions
  attachCookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const login = async (req, res) => {
  const { email, password } = req.body

  // check if email or password is available
  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password')
  }

  // get user
  const user = await User.findOne({ email })

  // valid user?
  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid credentials')
  }

  // valid password?
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid credentials')
  }

  // attach cookie if all is correct
  const tokenUser = {
    name: user.name,
    userID: user._id,
    role: user.role,
  }

  // attach cookie to response using JWT functions
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })

  res.status(StatusCodes.OK).json({ msg: 'user logged out' })
}

module.exports = { register, login, logout }
