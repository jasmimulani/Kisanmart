import React, { useEffect, useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";
import {
  FiTrash2,
  FiCopy,
  FiEye,
  FiEyeOff,
  FiSearch,
  FiUser,
  FiMail,
  FiLock,
  FiTruck,
  FiPhone
} from "react-icons/fi";

const DeliveryList = () => {
  const { axios } = useAppContext();
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState({});

  const fetchDeliveryBoys = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/delivery/list");
      if (data.success) {
        setList(data.list);
        setFilteredList(data.list);
      } else {
        toast.error(data.message);
      }
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

  const togglePassword = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = list.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.email.toLowerCase().includes(query)
    );
    setFilteredList(filtered);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="p-2 bg-green-100 rounded-lg">
                <FiTruck className="text-green-600 w-8 h-8" />
              </span>
              Delivery Partners
            </h2>
            <p className="text-gray-500 mt-1">Manage and monitor all delivery personnel</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-gray-100 shadow-sm" />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <FiSearch className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">No results found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((d) => (
              <div
                key={d._id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all duration-300 overflow-hidden"
              >
                {/* Card Header Color Strip */}
                <div className="h-1.5 bg-gradient-to-r from-green-500 to-green-600" />

                <div className="p-6">
                  {/* User Basic Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 font-bold text-xl group-hover:scale-110 transition-transform">
                        {d.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg leading-tight">{d.name}</h4>
                        <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-xs font-medium uppercase tracking-wider">Active Status</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between group/field">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiMail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm truncate max-w-[180px]">{d.email}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(d.email, "Email")}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors opacity-0 group-hover/field:opacity-100"
                        title="Copy Email"
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between group/field">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiLock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                          {showPassword[d._id] ? d.password : "••••••••"}
                        </span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover/field:opacity-100 transition-opacity">
                        <button
                          onClick={() => togglePassword(d._id)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={showPassword[d._id] ? "Hide Password" : "Show Password"}
                        >
                          {showPassword[d._id] ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(d.password, "Password")}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Copy Password"
                        >
                          <FiCopy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-end gap-3">
                    <button
                      onClick={() => removeDeliveryBoy(d._id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all w-full justify-center group/del"
                    >
                      <FiTrash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
                      Remove Partner
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryList;
