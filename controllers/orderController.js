const Order = require('../models/Order')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { checkPermissions } = require('../utils')

// fake function
const fakeStripeAPI = async ({ amount, curency }) => {
  const clientSecret = 'someRandomValue'
  return { clientSecret, amount }
}

const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const getSingleOrder = async (req, res) => {
  const orderId = req.params.id
  const order = await Order.findOne({ _id: orderId })

  if (!order) {
    throw new CustomError(`No order found with that id : ${orderId}`)
  }

  checkPermissions(req.user, order.user)

  res.status(StatusCodes.OK).json({ order })
}

const getCurrentUserOrders = async (req, res) => {
  const currentUserId = req.user.userId
  const orders = await Order.find({ user: currentUserId })

  if (!orders) {
    throw new CustomError(`No orders found for user ${req.user.name}`)
  }

  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const createOrder = async (req, res) => {
  // Look at SingleCartItem Schema for this
  const { items: cartItems, tax, shippingFee } = req.body

  // check if cart exists/has items in it
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('No cart items provided')
  }

  // validate
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError('Please provide tax and shipping fee')
  }

  let orderItems = []
  let subtotal = 0
  // NOTE: can not use forEach or map
  // NOTE: use a for...of loop because it's an async operation inside of the loop
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product })
    // check if product exists
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product fuond with id: ${item.product}`
      )
    }
    // extract valuies we need from the Product
    const { name, price, image, _id } = dbProduct

    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    }
    // add item to order for each iteration
    orderItems = [...orderItems, singleOrderItem]
    // calculate subtotal in each iteration
    subtotal += item.amount * price
  } // end of loop

  //calculate total
  const total = tax + shippingFee + subtotal

  // get client secret
  // (using fake function,. not real Stripe library)
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'usd',
  })

  const order = await Order.create({
    orderItems,
    total,
    subTotal: subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.clientSecret,
    user: req.user.userId,
  })

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret })
}

const updateOrder = async (req, res) => {
  const orderId = req.params.id
  const paymentIntentId = req.body.paymentIntentId
  const order = await Order.findOne({ _id: orderId })

  if (!order) {
    throw new CustomError(`No order found with that id : ${orderId}`)
  }

  checkPermissions(req.user, order.user)

  order.paymentId = paymentIntentId
  order.status = 'paid'
  await order.save()

  res.status(StatusCodes.OK).json({ order })
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
}
