import React from "react";
import { useAppContext } from "../Context/AppContext";
import { Link } from "react-router-dom";
import { FiPlus, FiMinus, FiShoppingBag, FiStar } from "react-icons/fi";

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
    <div className="group bg-[#fcfaf7] rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(34,197,94,0.1)] transition-all duration-500 border border-stone-100 flex flex-col h-full">
      {/* IMAGE CONTAINER with organic feel */}
      <div className="relative p-3">
        <div className="relative aspect-[1/1] overflow-hidden rounded-[1.5rem] bg-stone-100">
          <Link to={`/product/${product._id}`} className="block h-full">
            <img
              src={product.image || "https://via.placeholder.com/300"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </Link>

          {/* ORGANIC BADGES */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.category && (
              <span className="bg-emerald-800/90 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm shadow-lg">
                🌿 {product.category}
              </span>
            )}
            {discountPercent && (
              <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg border border-orange-400/30">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* TOP RIGHT FAVORITE/INFO (Optional placeholder) */}
          <div className="absolute top-3 right-3">
            <div className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-emerald-800 shadow-sm border border-white/50">
              <FiStar className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT - Earthy Typography */}
      <div className="px-5 pb-6 pt-2 flex flex-col flex-1">
        <div className="flex-1">
          <Link to={`/product/${product._id}`}>
            <h3 className="font-bold text-stone-800 text-lg leading-snug line-clamp-2 hover:text-emerald-700 transition duration-300 mb-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-stone-400 font-medium mb-4 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Direct from Farm Source
          </p>
        </div>

        {/* PRICE & ADD ACTION */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-emerald-900 tracking-tight">
              {formatPrice(product.offerprice || product.price)}
            </span>
            {product.offerprice && (
              <span className="text-xs text-stone-400 line-through font-semibold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="shrink-0">
            {qty === 0 ? (
              <button
                onClick={() => addToCart(product._id)}
                className="w-12 h-12 bg-emerald-700 text-white flex items-center justify-center rounded-2xl font-bold transition-all duration-300 hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-200 active:scale-90 group/btn"
                title="Add to Cart"
              >
                <FiShoppingBag className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
              </button>
            ) : (
              <div className="flex flex-col items-center bg-stone-100 rounded-2xl p-1 gap-1 border border-stone-200">
                <button
                  onClick={() => increaseQty(product._id)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm hover:bg-emerald-700 hover:text-white transition-all active:scale-90"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
                <span className="font-bold text-emerald-900 text-sm">{qty}</span>
                <button
                  onClick={() => decreaseQty(product._id)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm hover:bg-emerald-700 hover:text-white transition-all active:scale-90"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
