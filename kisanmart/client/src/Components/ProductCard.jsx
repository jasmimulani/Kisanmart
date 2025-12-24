import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../Context/AppContext'

const ProductCard = ({ product }) => {
  const { addToCart, currency, cartItems, updateCartItem, removeFromeCart } = useAppContext()
  const navigate = useNavigate()

  if (!product) return null

  const imageSrc = Array.isArray(product.image) ? product.image[0] : product.image
  const price = product.offerprice ?? product.price ?? 0
  const qty = (cartItems && cartItems[product._id]) ? cartItems[product._id] : 0

  const handleAdd = (e) => { e.stopPropagation(); addToCart(product._id) }
  const handleIncrease = (e) => { e.stopPropagation(); updateCartItem(product._id, qty + 1) }
  const handleDecrease = (e) => { e.stopPropagation(); if (qty > 1) updateCartItem(product._id, qty - 1); else removeFromeCart(product._id) }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="relative h-48 bg-gray-100 cursor-pointer" onClick={() => navigate(`/products/${product.category?.toLowerCase()}/${product._id}`)}>
        <img src={imageSrc} alt={product.name} className="w-full h-full object-cover" />
        {product.isNew && <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">New</span>}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 cursor-pointer" onClick={(e)=>{e.stopPropagation(); navigate(`/products/${product.category?.toLowerCase()}/${product._id}`)}}>
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-green-700">{currency}{price}</span>
          {qty > 0 ? (
            <div className="flex items-center border rounded-md overflow-hidden">
              <button onClick={handleDecrease} aria-label="Decrease quantity" className="px-3 py-1 bg-gray-100 hover:bg-gray-200">−</button>
              <span className="px-3 py-1 min-w-[40px] text-center">{qty}</span>
              <button onClick={handleIncrease} aria-label="Increase quantity" className="px-3 py-1 bg-gray-100 hover:bg-gray-200">+</button>
            </div>
          ) : (
            <button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">Add</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard

