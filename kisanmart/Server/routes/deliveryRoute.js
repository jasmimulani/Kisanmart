import express from 'express'
import {
  registerDelivery,
  loginDelivery,
  isDeliveryAuth,
  deliveryLogout,
  getAssignedOrders,
  getDeliveryStats,
  updateOrderStatus,
  updateDeliveryProfile,
  changeDeliveryPassword,
  assignOrder,
  listDeliveryBoys,
  createDeliveryByAdmin,
  claimDeliveryToken,
} from '../controllers/deliveryController.js'
import authDeliveryBoy from '../middlewares/authDeliveryBoy.js'
import authSeller from '../middlewares/authSeller.js'

const router = express.Router()

router.post('/register', registerDelivery)
router.post('/login', loginDelivery)
router.get('/is-auth', authDeliveryBoy, isDeliveryAuth)
router.post('/logout', authDeliveryBoy, deliveryLogout)

router.get('/orders', authDeliveryBoy, getAssignedOrders)
router.get('/stats', authDeliveryBoy, getDeliveryStats)
router.put('/order/status', authDeliveryBoy, updateOrderStatus)
router.put('/profile', authDeliveryBoy, updateDeliveryProfile)
router.put('/change-password', authDeliveryBoy, changeDeliveryPassword)

// Admin assign order
router.put('/assign', authSeller, assignOrder)

// Admin: list delivery boys
router.get('/list', authSeller, listDeliveryBoys)

// Admin: create delivery boy and return token/credentials
router.post('/create', authSeller, createDeliveryByAdmin)

// Delivery: claim a token to set auth cookie (used by delivery boy via link)
router.post('/claim', claimDeliveryToken)

export default router
