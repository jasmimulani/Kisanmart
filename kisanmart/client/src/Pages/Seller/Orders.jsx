import React, { useEffect, useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deliveryBoys, setDeliveryBoys] = useState([]);

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
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-medium">Orders List</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm font-medium">
              Total Orders: {orders.length}
            </span>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded"
            >
              <img
                src={assets.refresh_icon}
                alt="refresh"
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* NO ORDERS */}
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found</p>
        ) : (
          orders.map((order, index) => {
            // ✅ TOTAL AMOUNT (same logic as MyOrder)
            const totalAmount = order.items.reduce((sum, item) => {
              const price =
                item.product?.offerprice ??
                item.product?.price ??
                0;
              return sum + price * item.quantity;
            }, 0);

            return (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300"
              >
                {/* ITEMS */}
                <div className="flex gap-5 max-w-80">
                  <img
                    className="w-12 h-12 object-cover"
                    src={assets.box_icon}
                    alt="boxIcon"
                  />
                  <div>
                    {order.items.map((item, i) => (
                      <p key={i} className="font-medium">
                        {item.product?.name || "Product"}{" "}
                        <span className="text-primary">
                          x {item.quantity}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* DELIVERY ASSIGN */}
                <div className="flex gap-2 items-center">
                  <select
                    className="border p-1 rounded"
                    defaultValue={order.deliveryBoyId || ""}
                    onChange={(e) =>
                      (order._selectedDelivery = e.target.value)
                    }
                  >
                    <option value="">-- Assign delivery --</option>
                    {deliveryBoys.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={async () => {
                      const deliveryBoyId = order._selectedDelivery;
                      if (!deliveryBoyId) {
                        toast.error("Select delivery boy");
                        return;
                      }
                      try {
                        const { data } = await axios.put(
                          "/api/delivery/assign",
                          { orderId: order._id, deliveryBoyId }
                        );
                        if (data.success) {
                          toast.success("Assigned");
                          fetchOrders();
                        } else toast.error(data.message);
                      } catch (error) {
                        toast.error(error.message);
                      }
                    }}
                    className="px-2 py-1 border rounded"
                  >
                    Assign
                  </button>
                </div>

                {/* ADDRESS */}
                <div className="text-sm text-black/60">
                  <p>{order.address?.street}</p>
                  <p>
                    {order.address?.city}, {order.address?.state}
                  </p>
                  <p>{order.address?.phone}</p>
                </div>

                {/* ✅ TOTAL */}
                <p className="font-semibold text-primary my-auto">
                  Total Amount: {currency} {totalAmount}
                </p>

                {/* PAYMENT */}
                <div className="text-sm text-black/60">
                  <p>
                    Method:
                    <span className="font-medium ml-1">
                      {order.paymentType}
                    </span>
                  </p>
                  <p>
                    Date:{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
