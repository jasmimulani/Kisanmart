import React, { useEffect, useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";

const Orders = () => {
  const { axios, currency } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/delivery/orders");
      if (data.success) setOrders(data.orders || []);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await axios.put(
        "/api/delivery/order/status",
        { orderId, status }
      );
      if (data.success) {
        toast.success(data.message || "Updated");
        fetchOrders();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">
        Assigned Orders
      </h2>

      {orders.length === 0 ? (
        <p>No orders assigned</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((o) => {
            // ✅ CALCULATE TOTAL SAFELY
            const totalAmount = o.items.reduce((sum, item) => {
              const price =
                item.product?.offerprice ??
                item.product?.price ??
                0;
              return sum + price * item.quantity;
            }, 0);

            return (
              <div
                key={o._id}
                className="border p-4 rounded-md"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">

                  {/* ORDER INFO */}
                  <div>
                    <p className="font-medium">
                      Order ID: {o._id}
                    </p>
                    <p>Status: {o.status}</p>
                    <p className="font-semibold text-primary">
                      Amount: {currency} {totalAmount}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() =>
                        updateStatus(o._id, "Out for delivery")
                      }
                      className="border px-3 py-1 rounded"
                    >
                      Out for delivery
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(o._id, "Delivered")
                      }
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Delivered
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
