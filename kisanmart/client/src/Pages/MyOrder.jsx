import React, { useEffect, useState } from "react";
import { useAppContext } from "../Context/AppContext";

const MyOrder = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get(
        `/api/order/user?userId=${user._id}`
      );
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error.message);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className="my-16 pb-16 max-w-5xl mx-auto px-4">
      {/* TITLE */}
      <div className="mb-8">
        <p className="text-2xl font-semibold uppercase">
          My Orders
        </p>
        <div className="w-16 h-0.5 bg-primary mt-1 rounded-full"></div>
      </div>

      {/* NO ORDERS */}
      {myOrders.length === 0 && (
        <p className="text-center text-gray-500 text-lg">
          No orders yet.
        </p>
      )}

      {/* ORDERS */}
      {myOrders.map((order) => {
        // 🔹 Calculate TOTAL ONLY from items
        const totalAmount = order.items.reduce((sum, item) => {
          const price =
            item.product?.offerprice ??
            item.product?.price ??
            0;
          return sum + price * item.quantity;
        }, 0);

        return (
          <div
            key={order._id}
            className="border border-gray-300 rounded-lg mb-10 p-4"
          >
            {/* ORDER HEADER */}
            <div className="flex flex-wrap gap-3 justify-between text-sm text-gray-500 mb-4">
              <span>
                <b>Order ID:</b> {order._id}
              </span>
              <span>
                <b>Payment:</b> {order.paymentType}
              </span>
              <span>
                <b>Date:</b>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            {/* ITEMS */}
            {order.items.map((item) => {
              const price =
                item.product?.offerprice ??
                item.product?.price ??
                0;

              return (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row items-center justify-between border-t pt-4 gap-6"
                >
                  {/* PRODUCT INFO */}
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <img
                        src={item.product?.image?.[0]}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-800">
                        {item.product?.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Category: {item.product?.category}
                      </p>
                    </div>
                  </div>

                  {/* QTY & STATUS */}
                  <div className="text-sm text-gray-600">
                    <p>Quantity: {item.quantity}</p>
                    <p>Status: {order.status || "Placed"}</p>
                  </div>

                  {/* ITEM TOTAL */}
                  <p className="text-primary text-lg font-semibold">
                    {currency} {price * item.quantity}
                  </p>
                </div>
              );
            })}

            {/* FINAL TOTAL */}
            <div className="flex justify-end mt-6 border-t pt-4">
              <p className="text-lg font-semibold text-primary">
                Total Amount: {currency} {totalAmount}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrder;
