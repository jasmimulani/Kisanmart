import mongoose from 'mongoose'

const deliveryBoySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  isLoggedIn: { type: Boolean, default: false },
}, { timestamps: true })

const DeliveryBoy = mongoose.models.deliveryboy || mongoose.model('deliveryboy', deliveryBoySchema)

export default DeliveryBoy
