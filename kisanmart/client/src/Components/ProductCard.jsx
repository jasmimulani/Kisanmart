import React from "react";
import { useAppContext } from "../Context/AppContext";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { cartItems, addToCart, increaseQty, decreaseQty } = useAppContext();
  const qty = cartItems?.[product._id] || 0;

  // INR price format
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace("₹", "₹ ");

  // Discount calculation
  const discountPercent =
    product.offerprice && product.offerprice < product.price
      ? Math.round(
          ((product.price - product.offerprice) / product.price) * 100
        )
      : null;

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">

      {/* IMAGE SECTION */}
      <div className="relative overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image || "https://via.placeholder.com/300"}
            alt={product.name}
            className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* CATEGORY BADGE (TOP-LEFT) */}
        {product.category && (
          <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
            {product.category}
          </span>
        )}

        {discountPercent && (
          <span className="absolute bottom-3 left-3 bg-gradient-to-r from-red-600 to-pink-500 text-white text-xs font-bold px-1 py-1 rounded-lg shadow-lg">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 min-h-[40px] hover:text-green-600 transition">
            {product.name}
          </h3>
        </Link>

        {/* PRICE */}
        <div className="mt-3">
          <span className="text-xl font-bold text-green-700">
            {formatPrice(product.offerprice || product.price)}
          </span>

          {product.offerprice && (
            <span className="ml-2 text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* CART ACTION */}
        <div className="mt-auto pt-4">
          {qty === 0 ? (
            <button
              onClick={() => addToCart(product._id)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-medium transition"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between border rounded-xl px-3 py-2">
              <button
                onClick={() => decreaseQty(product._id)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-lg"
              >
                -
              </button>
              <span className="font-semibold">{qty}</span>
              <button
                onClick={() => increaseQty(product._id)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-lg"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
