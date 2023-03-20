const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const register = async (req, res) => {
  try {
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
    res.status(StatusCodes.CREATED).json({ newUser })
  } catch (error) {
    console.log(error)
  }
}

const login = async (req, res) => {
  res.send('login user')
}

const logout = async (req, res) => {
  res.send('logout user')
}

module.exports = { register, login, logout }
