import React, { useEffect, useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import { FiPackage, FiMapPin, FiPhone, FiMail, FiUser, FiCheckCircle, FiClock, FiTruck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const Orders = () => {
  const { axios, currency } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, inProgress, completed

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/delivery/orders");
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await axios.put("/api/delivery/order/status", {
        orderId,
        status,
      });
      if (data.success) {
        toast.success(data.message || "Order status updated successfully");
        fetchOrders();
        setSelectedOrder(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    if (status === "Delivered" || status === "completed") {
      return "bg-green-100 text-green-700 border-green-300";
    }
    if (status === "Out for delivery") {
      return "bg-blue-100 text-blue-700 border-blue-300";
    }
    if (status === "Assigned to delivery" || status === "pending") {
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "pending") {
      return order.status === "Assigned to delivery" || order.status === "pending";
    }
    if (filter === "inProgress") {
      return order.status === "Out for delivery";
    }
    if (filter === "completed") {
      return order.status === "Delivered" || order.status === "completed";
    }
    return true;
  });

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Orders</h2>
          <p className="text-gray-600 mt-1">Manage your delivery assignments</p>
        </div>
        <button
          onClick={fetchOrders}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {[
          { key: "all", label: "All Orders", count: orders.length },
          {
            key: "pending",
            label: "Pending",
            count: orders.filter(
              (o) => o.status === "Assigned to delivery" || o.status === "pending"
            ).length,
          },
          {
            key: "inProgress",
            label: "In Progress",
            count: orders.filter((o) => o.status === "Out for delivery").length,
          },
          {
            key: "completed",
            label: "Completed",
            count: orders.filter(
              (o) => o.status === "Delivered" || o.status === "completed"
            ).length,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              filter === tab.key
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-gray-400 text-sm mt-2">
            {filter !== "all"
              ? `No ${filter} orders at the moment`
              : "You don't have any assigned orders yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => {
            const totalAmount =
              order.items?.reduce((sum, item) => {
                const price =
                  item.product?.offerprice ?? item.product?.price ?? 0;
                return sum + price * item.quantity;
              }, 0) || order.amount || 0;

            return (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Order Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    {order.userId && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <FiUser className="w-5 h-5" />
                          Customer Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiUser className="w-4 h-4" />
                            <span>
                              {typeof order.userId === 'object' && order.userId.name
                                ? order.userId.name
                                : typeof order.userId === 'string'
                                ? `User ID: ${order.userId.slice(-6)}`
                                : "N/A"}
                            </span>
                          </div>
                          {typeof order.userId === 'object' && order.userId.email && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <FiMail className="w-4 h-4" />
                              <span>{order.userId.email}</span>
                            </div>
                          )}
                          {typeof order.userId === 'object' && order.userId.phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <FiPhone className="w-4 h-4" />
                              <span>{order.userId.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Delivery Address */}
                    {order.address && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <FiMapPin className="w-5 h-5" />
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
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Order Items ({order.items?.length || 0})
                      </h4>
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                          >
                            <div className="flex items-center gap-3">
                              {item.product?.image && (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-800">
                                  {item.product?.name || "Product"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity} × {currency}
                                  {item.product?.offerprice ??
                                    item.product?.price ??
                                    0}
                                </p>
                              </div>
                            </div>
                            <p className="font-semibold text-gray-800">
                              {currency}
                              {(
                                (item.product?.offerprice ??
                                  item.product?.price ??
                                  0) * item.quantity
                              ).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order Summary & Actions */}
                  <div className="lg:w-80 space-y-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Order Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">
                            {currency}
                            {totalAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment:</span>
                          <span className="font-medium capitalize">
                            {order.paymentType || "N/A"}
                          </span>
                        </div>
                        <div className="border-t border-green-200 pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-800">
                              Total:
                            </span>
                            <span className="font-bold text-lg text-green-600">
                              {currency}
                              {totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {(order.status === "Assigned to delivery" ||
                        order.status === "pending") && (
                        <button
                          onClick={() => updateStatus(order._id, "Out for delivery")}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <FiTruck className="w-5 h-5" />
                          Start Delivery
                        </button>
                      )}

                      {order.status === "Out for delivery" && (
                        <button
                          onClick={() => updateStatus(order._id, "Delivered")}
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <FiCheckCircle className="w-5 h-5" />
                          Mark as Delivered
                        </button>
                      )}

                      {(order.status === "Delivered" ||
                        order.status === "completed") && (
                        <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg text-center font-medium">
                          <FiCheckCircle className="w-5 h-5 inline mr-2" />
                          Order Completed
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                Order #{selectedOrder._id.slice(-8).toUpperCase()}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Add detailed order view here if needed */}
              <p className="text-gray-600">
                Full order details view can be added here
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
