import React, { useEffect, useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";

const DeliveryList = () => {
  const { axios } = useAppContext();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDeliveryBoys = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/delivery/list");
      if (data.success) setList(data.list);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeDeliveryBoy = async (id) => {
    if (!window.confirm("Are you sure you want to remove this delivery boy?")) return;
    try {
      const { data } = await axios.post("/api/delivery/remove", { id });
      if (data.success) {
        toast.success(data.message);
        fetchDeliveryBoys();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  return (
    <div className="min-h-screen p-8 font-sans">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800"> Delivery Boys</h2>

      {loading ? (
        <div className="bg-white p-5 rounded-lg text-gray-600 shadow">Loading delivery boys...</div>
      ) : list.length === 0 ? (
        <div className="bg-white p-5 rounded-lg text-gray-600 shadow">No delivery boys found</div>
      ) : (
        <div className="flex flex-col gap-4">
          {list.map((d) => (
            <div
              key={d._id}
              className="bg-white p-5 rounded-xl flex justify-between items-center shadow-md transition-transform transform hover:-translate-y-1 md:flex-row flex-col gap-3"
            >
              <div className="flex flex-col">
                <h4 className="text-gray-800 text-lg font-medium">{d.name}</h4>
                <p className="text-gray-500 text-sm mt-1">Email: {d.email}</p>
                <p className="text-gray-500 text-sm mt-1">Password: {d.password}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors hover:bg-green-900"
                  onClick={() => {
                    navigator.clipboard.writeText(d.email);
                    toast.success("Email copied!");
                  }}
                >
                  Copy Email
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors hover:bg-red-800"
                  onClick={() => removeDeliveryBoy(d._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryList;
