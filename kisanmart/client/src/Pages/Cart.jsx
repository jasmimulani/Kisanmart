import React, { useEffect, useState, useRef } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../Context/AppContext";
import toast from "react-hot-toast";
import {
  FiLoader,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiMapPin,
  FiCreditCard,
  FiShoppingBag,
  FiArrowLeft,
  FiArrowRight
} from "react-icons/fi";

const Cart = () => {
  const {
    products,
    currency,
    removeFromCart,
    cartItems,
    getCartCount,
    increaseQty,
    decreaseQty,
    navigate,
    getCartAmount,
    axios,
    user,
    SetCartItems,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectAddress, setSelectAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const isProcessingRef = useRef(false);

  /* ---------------- BUILD CART ARRAY ---------------- */
  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      if (!product) continue;
      tempArray.push({ ...product, quantity: cartItems[key] });
    }
    setCartArray(tempArray);
  };

  /* ---------------- GET USER ADDRESS ---------------- */
  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddress(data.address);
        if (data.address.length > 0) {
          setSelectAddress(data.address[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* ---------------- PLACE ORDER ---------------- */
  const PlaceOrder = async () => {
    if (isProcessingRef.current || isPlacingOrder) {
      toast.error("Order is already being processed. Please wait...");
      return;
    }

    if (!selectAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!user) {
      toast.error("Please login to place an order");
      return;
    }

    if (cartArray.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    isProcessingRef.current = true;
    setIsPlacingOrder(true);

    try {
      const payload = {
        userId: user._id,
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        address: selectAddress._id,
      };

      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", payload);
        if (data.success) {
          toast.success(data.message || "Order placed successfully!");
          SetCartItems({});
          setTimeout(() => {
            navigate("/my-orders");
          }, 500);
        } else {
          toast.error(data.message || "Failed to place order");
          isProcessingRef.current = false;
          setIsPlacingOrder(false);
        }
      } else {
        const { data } = await axios.post("/api/order/stripe", payload);
        if (data.success && data.url) {
          SetCartItems({});
          window.location.replace(data.url);
        } else {
          toast.error(data.message || "Failed to initiate payment");
          isProcessingRef.current = false;
          setIsPlacingOrder(false);
        }
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to place order. Please try again.");
      isProcessingRef.current = false;
      setIsPlacingOrder(false);
    }
  };

  useEffect(() => {
    if (products.length && cartItems) getCart();
  }, [products, cartItems]);

  useEffect(() => {
    if (user) getUserAddress();
  }, [user]);

  if (!products.length || !cartItems) return null;

  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4 md:px-8 lg:px-16 mt-16">
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-emerald-600 font-black uppercase tracking-widest text-sm mb-2">
              <FiShoppingBag className="w-5 h-5" />
              <span>Checkout Process</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-stone-900 leading-tight">
              My Shopping <span className="text-emerald-600">Basket</span>
            </h1>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-stone-500 font-bold hover:text-emerald-700 transition"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Continue Harvesting</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* CART ITEMS LIST */}
          <div className="flex-1 space-y-6">
            {cartArray.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-20 text-center border border-stone-100 shadow-sm flex flex-col items-center">
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                  <FiShoppingBag className="w-10 h-10 text-stone-300" />
                </div>
                <h3 className="text-2xl font-black text-stone-800 mb-2">Your basket is empty</h3>
                <p className="text-stone-500 mb-8 max-w-xs">Looks like you haven't added any farm-fresh products yet.</p>
                <button
                  onClick={() => navigate("/products")}
                  className="px-10 py-4 bg-emerald-700 text-white rounded-full font-black text-lg shadow-xl shadow-emerald-900/10 hover:bg-emerald-800 transition transform hover:-translate-y-1"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartArray.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-[2rem] p-6 flex flex-col sm:flex-row items-center gap-6 border border-stone-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-emerald-100"
                >
                  {/* Product Image */}
                  <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-2xl cursor-pointer"
                      onClick={() => navigate(`/product/${product._id}`)}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h3 className="font-black text-stone-800 text-xl leading-tight hover:text-emerald-700 cursor-pointer transition" onClick={() => navigate(`/product/${product._id}`)}>
                          {product.name}
                        </h3>
                        <p className="text-sm text-stone-400 font-medium mt-1">🌿 Premium Quality</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-emerald-800 tracking-tight">
                          {currency}{product.offerprice * product.quantity}
                        </p>
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">
                          {currency}{product.offerprice} / unit
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      {/* Qty Controls */}
                      <div className="flex items-center bg-stone-100 rounded-2xl p-1 border border-stone-200">
                        <button
                          onClick={() => decreaseQty(product._id)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm hover:bg-emerald-700 hover:text-white transition-all"
                        >
                          <FiMinus className="w-5 h-5" />
                        </button>
                        <span className="w-12 text-center font-black text-emerald-900 text-lg">
                          {cartItems[product._id]}
                        </span>
                        <button
                          onClick={() => increaseQty(product._id)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm hover:bg-emerald-700 hover:text-white transition-all"
                        >
                          <FiPlus className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(product._id)}
                        className="p-3 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                        title="Remove Item"
                      >
                        <FiTrash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SUMMARY SIDEBAR */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-2xl shadow-stone-200/50 sticky top-24">
              <h2 className="text-2xl font-black text-stone-900 mb-8">Harvest Summary</h2>

              {/* Delivery Address Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="flex items-center gap-2 text-stone-400 text-xs font-black uppercase tracking-widest">
                    <FiMapPin className="text-emerald-600" />
                    <span>Delivery To</span>
                  </p>
                  <button
                    onClick={() => setShowAddress(!showAddress)}
                    className="text-emerald-700 font-bold text-xs hover:underline"
                  >
                    {selectAddress ? "Edit" : "Select"}
                  </button>
                </div>

                <div className="bg-stone-50/50 rounded-3xl p-5 border border-stone-100">
                  {selectAddress ? (
                    <div>
                      <p className="text-stone-800 font-bold leading-tight">
                        {selectAddress.street}
                      </p>
                      <p className="text-stone-500 text-sm mt-1">
                        {selectAddress.city}, {selectAddress.state}
                      </p>
                    </div>
                  ) : (
                    <p className="text-stone-400 italic text-sm">No delivery address selected</p>
                  )}
                </div>

                {showAddress && (
                  <div className="mt-4 bg-white border border-stone-100 rounded-3xl shadow-xl overflow-hidden max-h-60 overflow-y-auto z-30 relative">
                    {addresses.map((address, i) => (
                      <p
                        key={i}
                        onClick={() => {
                          setSelectAddress(address);
                          setShowAddress(false);
                        }}
                        className="p-4 text-sm font-bold text-stone-700 cursor-pointer hover:bg-emerald-50 hover:text-emerald-800 transition-colors border-b border-stone-50 last:border-0"
                      >
                        {address.street}, {address.city}
                      </p>
                    ))}
                    <p
                      onClick={() => navigate("/add-address")}
                      className="p-4 text-center text-emerald-700 font-black text-sm cursor-pointer hover:bg-emerald-50"
                    >
                      + Add New Location
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Select */}
              <div className="mb-8">
                <p className="flex items-center gap-2 text-stone-400 text-xs font-black uppercase tracking-widest mb-4">
                  <FiCreditCard className="text-emerald-600" />
                  <span>Payment Method</span>
                </p>
                <div className="relative">
                  <select
                    onChange={(e) => setPaymentOption(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-100 p-4 rounded-3xl font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer"
                  >
                    <option value="COD">Cash On Delivery (Organic)</option>
                    <option value="Online">Online Payment (Stripe)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-4 border-t border-stone-100 pt-8 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-bold">Subtotal</span>
                  <span className="text-stone-800 font-bold">{currency}{getCartAmount()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-bold">Logistics</span>
                  <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px] bg-emerald-50 px-2 py-1 rounded-full">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-black text-stone-900">Total Total</span>
                  <span className="text-3xl font-black text-emerald-900 tracking-tight">
                    {currency}{getCartAmount()}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={PlaceOrder}
                disabled={isPlacingOrder || cartArray.length === 0 || !selectAddress}
                className={`group w-full py-5 rounded-[2rem] font-black text-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl ${isPlacingOrder || cartArray.length === 0 || !selectAddress
                  ? "bg-stone-100 text-stone-400 cursor-not-allowed shadow-none"
                  : "bg-emerald-700 text-white hover:bg-emerald-800 hover:-translate-y-1 shadow-emerald-900/10 active:scale-95"
                  }`}
              >
                {isPlacingOrder ? (
                  <>
                    <FiLoader className="w-6 h-6 animate-spin" />
                    <span>Harvesting Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Order</span>
                    <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {!selectAddress && cartArray.length > 0 && (
                <p className="text-xs text-center text-red-500 font-bold mt-4 animate-pulse">
                  ⚠ Please specify a delivery location
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
