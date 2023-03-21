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
  res.send('login user')
}

const logout = async (req, res) => {
  res.send('logout user')
}

module.exports = { register, login, logout }
