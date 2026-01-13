import React, { useEffect, useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import { FiPackage, FiRefreshCw, FiSearch, FiFilter, FiMapPin, FiPhone, FiMail, FiUser, FiTruck, FiCheckCircle, FiClock, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryBoys = async () => {
    try {
      const { data } = await axios.get("/api/delivery/list");
      if (data.success) setDeliveryBoys(data.list || []);
    } catch (error) {
      console.error("Error fetching delivery boys", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDeliveryBoys();
    const interval = setInterval(fetchOrders, 30000); // Auto refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const assignDelivery = async (orderId, deliveryBoyId) => {
    if (!deliveryBoyId) {
      toast.error("Please select a delivery boy");
      return;
    }
    try {
      const { data } = await axios.put("/api/delivery/assign", {
        orderId,
        deliveryBoyId,
      });
      if (data.success) {
        toast.success("Order assigned successfully");
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address?.street?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" ||
      order.status === statusFilter ||
      (statusFilter === "pending" && (order.status === "Order Placed" || order.status === "pending")) ||
      (statusFilter === "completed" && (order.status === "Delivered" || order.status === "completed"));

    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="flex-1 h-[95vh] overflow-y-auto p-4 md:p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Orders Management</h2>
            <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-sm font-medium">
              Total: {orders.length} | Showing: {filteredOrders.length}
            </span>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Order ID, address, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FiFilter className="w-5 h-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="Assigned to delivery">Assigned</option>
                <option value="Out for delivery">In Transit</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200">
            <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No orders found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "No orders have been placed yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
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
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
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
                          {order.items?.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                            >
                              <div className="flex items-center gap-3">
                                {item.product?.image?.[0] && (
                                  <img
                                    src={item.product.image[0]}
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
                                    {item.product?.offerprice ?? item.product?.price ?? 0}
                                  </p>
                                </div>
                              </div>
                              <p className="font-semibold text-gray-800">
                                {currency}
                                {(
                                  (item.product?.offerprice ?? item.product?.price ?? 0) *
                                  item.quantity
                                ).toFixed(2)}
                              </p>
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <p className="text-sm text-gray-500 text-center">
                              +{order.items.length - 3} more items
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Summary & Actions */}
                    <div className="lg:w-80 space-y-4">
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <h4 className="font-semibold text-gray-700 mb-3">Order Summary</h4>
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
                              <span className="font-semibold text-gray-800">Total:</span>
                              <span className="font-bold text-lg text-green-600">
                                {currency}
                                {totalAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Assignment */}
                      {(!order.deliveryBoyId || order.status === "Order Placed" || order.status === "pending") && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FiTruck className="w-5 h-5" />
                            Assign Delivery
                          </h4>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            defaultValue={order.deliveryBoyId || ""}
                            onChange={(e) => {
                              if (e.target.value) {
                                assignDelivery(order._id, e.target.value);
                              }
                            }}
                          >
                            <option value="">-- Select delivery boy --</option>
                            {deliveryBoys
                              .filter((d) => d.isActive)
                              .map((d) => (
                                <option key={d._id} value={d._id}>
                                  {d.name} {d.isLoggedIn && "🟢"}
                                </option>
                              ))}
                          </select>
                          {order.deliveryBoyId && (
                            <p className="text-sm text-green-600">
                              ✓ Assigned to delivery partner
                            </p>
                          )}
                        </div>
                      )}

                      {order.deliveryBoyId && (
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <p className="text-sm text-purple-700">
                            <strong>Assigned to:</strong>{" "}
                            {deliveryBoys.find((d) => d._id === order.deliveryBoyId)?.name ||
                              "Delivery Partner"}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        View Full Details
                      </button>
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
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
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
                {/* Full order details can be added here */}
                <p className="text-gray-600">Full order details view</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
