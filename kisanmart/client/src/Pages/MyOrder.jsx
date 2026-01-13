import React, { useEffect, useState } from "react";
import { useAppContext } from "../Context/AppContext";
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiPhone, FiMail, FiUser, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

const MyOrder = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currency, axios, user } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchMyOrders = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/order/user?userId=${user._id}`);
      if (data.success) {
        setMyOrders(data.orders || []);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error.message);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchMyOrders();
    }
  }, [user]);

  const getStatusIcon = (status) => {
    if (status === "Delivered" || status === "completed") {
      return <FiCheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (status === "Out for delivery") {
      return <FiTruck className="w-5 h-5 text-blue-600" />;
    }
    return <FiClock className="w-5 h-5 text-yellow-600" />;
  };

  const getStatusColor = (status) => {
    if (status === "Delivered" || status === "completed") {
      return "bg-green-100 text-green-700 border-green-300";
    }
    if (status === "Out for delivery") {
      return "bg-blue-100 text-blue-700 border-blue-300";
    }
    if (status === "Assigned to delivery") {
      return "bg-purple-100 text-purple-700 border-purple-300";
    }
    return "bg-yellow-100 text-yellow-700 border-yellow-300";
  };

  if (!user) {
    return (
      <div className="my-16 pb-16 max-w-5xl mx-auto px-4">
        <div className="text-center py-12">
          <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Please login to view your orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-16 pb-16 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
            <p className="text-gray-600 mt-1">Track and manage your orders</p>
          </div>
          <button
            onClick={fetchMyOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
        <div className="w-16 h-1 bg-green-600 rounded-full"></div>
      </div>

      {/* Loading State */}
      {loading && myOrders.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
        </div>
      )}

      {/* No Orders */}
      {!loading && myOrders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200">
          <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No orders yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Start shopping to see your orders here
          </p>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-6">
        {myOrders.map((order) => {
          const totalAmount = order.items.reduce((sum, item) => {
            const price =
              item.product?.offerprice ?? item.product?.price ?? 0;
            return sum + price * item.quantity;
          }, 0);

          return (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status || "Order Placed")}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        order.status || "Order Placed"
                      )}`}
                    >
                      {order.status || "Order Placed"}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {currency}
                      {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                {/* Payment Info */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Payment Method:</span>
                    <span className="capitalize">{order.paymentType || "N/A"}</span>
                    {order.isPaid && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                        Paid
                      </span>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                {order.address && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FiMapPin className="w-4 h-4" />
                      Delivery Address
                    </h4>
                    <p className="text-sm text-gray-600">
                      {order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipcode}
                    </p>
                    {order.address.phone && (
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <FiPhone className="w-4 h-4" />
                        {order.address.phone}
                      </p>
                    )}
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4">
                    Order Items ({order.items?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => {
                      const price =
                        item.product?.offerprice ?? item.product?.price ?? 0;
                      const itemTotal = price * item.quantity;

                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {/* Product Image */}
                          {item.product?.image?.[0] && (
                            <div className="flex-shrink-0">
                              <img
                                src={item.product.image[0]}
                                alt={item.product.name}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              />
                            </div>
                          )}

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-800 mb-1">
                              {item.product?.name || "Product"}
                            </h5>
                            <p className="text-sm text-gray-500 mb-2">
                              Category: {item.product?.category || "N/A"}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Quantity: <strong>{item.quantity}</strong></span>
                              <span>Price: <strong>{currency}{price.toFixed(2)}</strong></span>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              {currency}
                              {itemTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Total */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {currency}
                      {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrder;
