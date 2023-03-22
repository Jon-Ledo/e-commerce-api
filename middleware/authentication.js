const CustomError = require('../errors')
const { isTokenValid } = require('../utils')

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication invalid')
  }

  try {
    // passes the user object to every request passing this middleware
    const payload = isTokenValid({ token })
    req.user = {
      name: payload.name,
      userId: payload.userID,
      role: payload.role,
    }
    next()
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication invalid')
  }
}

// const authorizePermissions = (req, res, next) => {
//   if (req.user.role !== 'admin') {
//     throw new CustomError.UnauthorizedError('Unauthorized to access this route')
//   }
//   next()
// }

// in order to pass arguments to the middleware in the route, we need to transform the middleware into a callback
// the roles in the middleware are ['admin', 'owner']
const authorizePermissions = (...roles) => {
  // we create a callback that uses the express req,res and next
  return (req, res, next) => {
    // use array method to check if the roles arguyment matches the req.uer.role
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized  to access this route'
      )
    }
    next()
  }
}

module.exports = { authenticateUser, authorizePermissions }
