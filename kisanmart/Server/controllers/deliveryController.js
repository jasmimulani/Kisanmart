import DeliveryBoy from '../models/DeliveryBoy.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Order from '../models/Order.js'

// register delivery boy
export const registerDelivery = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body
    if (!name || !email || !password) return res.json({ success: false, message: 'Missing details' })

    const inputEmail = String(email).trim().toLowerCase()
    if (!inputEmail.includes('@') || !inputEmail.endsWith('.com')) {
      return res.json({ success: false, message: "Email must contain '@' and end with '.com'" })
    }

    const existing = await DeliveryBoy.findOne({ email: inputEmail })
    if (existing) return res.json({ success: false, message: 'Delivery boy already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const delivery = await DeliveryBoy.create({ name, email: inputEmail, password: hashed, phone })

    const token = jwt.sign({ id: delivery._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.cookie('deliveryToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({ success: true, message: 'Registered', profile: { name: delivery.name, email: delivery.email } })
  } catch (error) {
    console.error('registerDelivery', error)
    res.json({ success: false, message: error.message })
  }
}

// login delivery boy
export const loginDelivery = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.json({ success: false, message: 'Email and password required' })

    const inputEmail = String(email).trim().toLowerCase()
    const delivery = await DeliveryBoy.findOne({ email: inputEmail })
    if (!delivery) return res.json({ success: false, message: 'Invalid credentials' })

    if (!delivery.isActive) return res.json({ success: false, message: 'Your account is blocked' })

    const isMatch = await bcrypt.compare(password, delivery.password)
    if (!isMatch) return res.json({ success: false, message: 'Invalid credentials' })

    delivery.isLoggedIn = true
    await delivery.save()

    const token = jwt.sign({ id: delivery._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.cookie('deliveryToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({ success: true, message: 'Logged in', profile: { name: delivery.name, email: delivery.email, phone: delivery.phone } })
  } catch (error) {
    console.error('loginDelivery', error)
    res.json({ success: false, message: error.message })
  }
}

// is auth
export const isDeliveryAuth = async (req, res) => {
  try {
    const delivery = await DeliveryBoy.findById(req.body.deliveryBoyId).select('-password')
    if (!delivery) return res.json({ success: false, message: 'Not authorized' })
    return res.json({ success: true, profile: delivery })
  } catch (error) {
    console.error('isDeliveryAuth', error)
    res.json({ success: false, message: error.message })
  }
}

// logout
export const deliveryLogout = async (req, res) => {
  try {
    const { deliveryBoyId } = req.body
    if (deliveryBoyId) {
      const d = await DeliveryBoy.findById(deliveryBoyId)
      if (d) {
        d.isLoggedIn = false
        await d.save()
      }
    }

    res.clearCookie('deliveryToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    })

    return res.json({ success: true, message: 'Logged out' })
  } catch (error) {
    console.error('deliveryLogout', error)
    res.json({ success: false, message: error.message })
  }
}

// get assigned orders
export const getAssignedOrders = async (req, res) => {
  try {
    const { deliveryBoyId } = req.body
    const orders = await Order.find({ deliveryBoyId }).populate('items.product')
    return res.json({ success: true, orders })
  } catch (error) {
    console.error('getAssignedOrders', error)
    res.json({ success: false, message: error.message })
  }
}

// update order status (delivery updates)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, deliveryBoyId } = req.body
    if (!orderId || !status) return res.json({ success: false, message: 'Missing params' })

    const order = await Order.findById(orderId)
    if (!order) return res.json({ success: false, message: 'Order not found' })

    if (!order.deliveryBoyId || String(order.deliveryBoyId) !== String(deliveryBoyId)) {
      return res.json({ success: false, message: 'Not authorized to update this order' })
    }

    order.status = status
    await order.save()
    return res.json({ success: true, message: 'Order updated', order })
  } catch (error) {
    console.error('updateOrderStatus', error)
    res.json({ success: false, message: error.message })
  }
}

// assign order to delivery boy (admin)
export const assignOrder = async (req, res) => {
  try {
    const { orderId, deliveryBoyId } = req.body
    if (!orderId || !deliveryBoyId) return res.json({ success: false, message: 'Missing params' })

    const order = await Order.findById(orderId)
    if (!order) return res.json({ success: false, message: 'Order not found' })

    order.deliveryBoyId = deliveryBoyId
    order.status = 'Assigned to delivery'
    await order.save()
    return res.json({ success: true, message: 'Order assigned' })
  } catch (error) {
    console.error('assignOrder', error)
    res.json({ success: false, message: error.message })
  }
}

// admin: list delivery boys
export const listDeliveryBoys = async (req, res) => {
  try {
    const list = await DeliveryBoy.find().select('-password')
    return res.json({ success: true, list })
  } catch (error) {
    console.error('listDeliveryBoys', error)
    res.json({ success: false, message: error.message })
  }
}

// admin: create delivery boy and optionally return credentials + token
export const createDeliveryByAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body
    if (!name || !email) return res.json({ success: false, message: 'Missing details' })

    const inputEmail = String(email).trim().toLowerCase()
    if (!inputEmail.includes('@') || !inputEmail.endsWith('.com')) {
      return res.json({ success: false, message: "Email must contain '@' and end with '.com'" })
    }

    const existing = await DeliveryBoy.findOne({ email: inputEmail })
    if (existing) return res.json({ success: false, message: 'Delivery boy already exists' })

    const tempPassword = password || Math.random().toString(36).slice(-8)
    const hashed = await bcrypt.hash(tempPassword, 10)

    // create account but do NOT auto-mark as logged in; delivery should login or claim token
    const delivery = await DeliveryBoy.create({ name, email: inputEmail, password: hashed, phone, isLoggedIn: false })

    // short-lived token to allow the delivery boy to claim session (optional)
    const token = jwt.sign({ id: delivery._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

    return res.json({ success: true, message: 'Delivery boy created', profile: { name: delivery.name, email: delivery.email, phone: delivery.phone, _id: delivery._id }, tempPassword, token })
  } catch (error) {
    console.error('createDeliveryByAdmin', error)
    res.json({ success: false, message: error.message })
  }
}

// delivery: claim token and set cookie (used by delivery boy to get logged in from link)
export const claimDeliveryToken = async (req, res) => {
  try {
    const { token } = req.body
    if (!token) return res.json({ success: false, message: 'Token required' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded || !decoded.id) return res.json({ success: false, message: 'Invalid token' })

    const delivery = await DeliveryBoy.findById(decoded.id)
    if (!delivery) return res.json({ success: false, message: 'Invalid token' })

    delivery.isLoggedIn = true
    await delivery.save()

    res.cookie('deliveryToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })

    return res.json({ success: true, message: 'Token claimed', profile: { name: delivery.name, email: delivery.email, phone: delivery.phone } })
  } catch (error) {
    console.error('claimDeliveryToken', error)
    res.json({ success: false, message: error.message })
  }
}