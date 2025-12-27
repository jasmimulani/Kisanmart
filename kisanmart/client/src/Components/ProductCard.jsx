import React from "react";
import { useAppContext } from "../Context/AppContext";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { cartItems, addToCart, increaseQty, decreaseQty } = useAppContext();
  const qty = cartItems?.[product._id] || 0;

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price).replace('₹', '₹ ');
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
      {/* Product Image with Badge */}
      <div className="relative overflow-hidden">
        <Link to={`/product/${product._id}`} className="block">
          <img
            src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
        </Link>
        {product.category && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            {product.category}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <Link to={`/product/${product._id}`} className="hover:text-green-600 transition-colors">
            <h3 className="font-medium text-gray-900 line-clamp-2 h-12">
              {product.name}
            </h3>
          </Link>
          
          {/* Price */}
          <div className="mt-2">
            <span className="text-lg font-bold text-green-700">
              {formatPrice(product.offerprice || product.price)}
            </span>
            {product.offerprice && product.offerprice < product.price && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart / Quantity Controls */}
        <div className="mt-auto pt-2">
          {qty === 0 ? (
            <button
              onClick={() => addToCart(product._id)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => decreaseQty(product._id)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <span className="text-xl">−</span>
              </button>
              <span className="font-medium">{qty}</span>
              <button
                onClick={() => increaseQty(product._id)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <span className="text-xl">+</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;