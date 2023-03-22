const CustomError = require('../errors')

const checkPermissions = (requestUser, resourceUserId) => {
  // console.log(requestUser)
  // console.log(resourceUserId)
  // console.log(typeof resourceUserId)

  // admins can view
  if (requestUser.role === 'admin') return

  // users can view their own details
  if (requestUser.userId === resourceUserId.toString()) return

  // error for anyone else
  throw new CustomError.UnauthorizedError(
    'Not authorized to access this resource'
  )
}

module.exports = checkPermissions
