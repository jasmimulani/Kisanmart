import React, { useEffect, useState, useRef } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../Context/AppContext";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";

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
    // Prevent multiple submissions
    if (isProcessingRef.current || isPlacingOrder) {
      toast.error("Order is already being processed. Please wait...");
      return;
    }

    // Validation
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

    // Set processing state
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
          // Small delay to show success message
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
          // Redirect to Stripe checkout
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

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    if (products.length && cartItems) getCart();
  }, [products, cartItems]);

  useEffect(() => {
    if (user) getUserAddress();
  }, [user]);

  if (!products.length || !cartItems) return null;

  return (
    <div className="flex flex-col md:flex-row mt-16">
      {/* ---------------- CART LIST ---------------- */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary">
            {getCartCount()} Items
          </span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 font-medium pb-3">
          <p>Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-[2fr_1fr_1fr] items-center pt-4"
          >
            <div className="flex gap-4">
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-24 h-24 object-cover border rounded cursor-pointer"
                onClick={() =>
                  navigate(
                    `/products/${product.category.toLowerCase()}/${product._id}`
                  )
                }
              />
              <div>
                <p className="font-semibold">{product.name}</p>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => decreaseQty(product._id)}
                    className="px-3 py-1 bg-gray-200 rounded font-bold"
                  >
                    −
                  </button>

                  <span className="font-semibold">
                    {cartItems[product._id]}
                  </span>

                  <button
                    onClick={() => increaseQty(product._id)}
                    className="px-3 py-1 bg-gray-200 rounded font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <p className="text-center">
              {currency}
              {product.offerprice * product.quantity}
            </p>

            <button
              onClick={() => removeFromCart(product._id)}
              className="mx-auto"
            >
              <img
                src={assets.remove_icon}
                alt="remove"
                className="w-6 h-6"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => navigate("/products")}
          className="mt-8 text-primary font-medium"
        >
          ← Continue Shopping
        </button>
      </div>

      {/* ---------------- ORDER SUMMARY ---------------- */}
      <div className="max-w-[360px] w-full  p-5 border ml-8">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="my-4" />

        <p className="text-sm font-medium uppercase">Delivery Address</p>
        <p className="text-gray-500 mt-2">
          {selectAddress
            ? `${selectAddress.street}, ${selectAddress.city}, ${selectAddress.state}, ${selectAddress.country}`
            : "No address found"}
        </p>

        <button
          onClick={() => setShowAddress(!showAddress)}
          className="text-primary mt-2"
        >
          Change Address
        </button>

        {showAddress && (
          <div className="border mt-2 bg-white">
            {addresses.map((address, i) => (
              <p
                key={i}
                onClick={() => {
                  setSelectAddress(address);
                  setShowAddress(false);
                }}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {address.street}, {address.city}
              </p>
            ))}
            <p
              onClick={() => navigate("/add-address")}
              className="p-2 text-center text-primary cursor-pointer"
            >
              Add new address
            </p>
          </div>
        )}

        <p className="text-sm font-medium uppercase mt-6">
          Payment Method
        </p>
        <select
          onChange={(e) => setPaymentOption(e.target.value)}
          className="w-full border p-2 mt-2"
        >
          <option value="COD">Cash On Delivery</option>
          <option value="Online">Online Payment</option>
        </select>

        <hr className="my-4" />

        <div className="space-y-2 text-gray-600">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {getCartAmount()}
            </span>
          </p>
          <p className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>
              {currency}
              {getCartAmount()}
            </span>
          </p>
        </div>

        <button
          onClick={PlaceOrder}
          disabled={isPlacingOrder || cartArray.length === 0 || !selectAddress}
          className={`w-full mt-6 bg-primary text-white py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            isPlacingOrder || cartArray.length === 0 || !selectAddress
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-primary/90 hover:shadow-lg"
          }`}
        >
          {isPlacingOrder ? (
            <>
              <FiLoader className="w-5 h-5 animate-spin" />
              <span>Processing Order...</span>
            </>
          ) : paymentOption === "COD" ? (
            "Place Order"
          ) : (
            "Proceed to Checkout"
          )}
        </button>
        
        {isPlacingOrder && (
          <p className="text-sm text-gray-500 text-center mt-2">
            Please wait while we process your order...
          </p>
        )}
      </div>
    </div>
  );
};

export default Cart;
