import jwt from 'jsonwebtoken'

const authDeliveryBoy = (req, res, next) => {
  try {
    const { deliveryToken } = req.cookies;
    if (!deliveryToken) {
      return res.json({ success: false, message: 'Not Authorized' });
    }

    const decoded = jwt.verify(deliveryToken, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.json({ success: false, message: 'Not Authorized' });
    }

    req.body = req.body || {}
    req.body.deliveryBoyId = decoded.id
    next()
  } catch (error) {
    return res.json({ success: false, message: 'Invalid token' })
  }
}

export default authDeliveryBoy
