import React, { useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import { assets } from "../../assets/assets";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FiHome, FiPackage, FiPlusCircle, FiList, FiShoppingBag, FiTruck, FiUsers, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const SellerLayout = () => {
  const { axios, navigate, setIsSeller, sellerProfile } = useAppContext();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarLinks = [
    { name: "Dashboard", path: "/seller/dashboard", icon: <FiHome className="w-5 h-5" /> },
    { name: "Add Product", path: "/seller/dashboard/add-product", icon: <FiPlusCircle className="w-5 h-5" /> },
    { name: "Product List", path: "/seller/dashboard/product-list", icon: <FiList className="w-5 h-5" /> },
    { name: "Orders", path: "/seller/dashboard/orders", icon: <FiShoppingBag className="w-5 h-5" /> },
    { name: "Delivery List", path: "/seller/dashboard/delivery-list", icon: <FiTruck className="w-5 h-5" /> },
    { name: "Create Delivery", path: "/seller/dashboard/create-delivery", icon: <FiPlusCircle className="w-5 h-5" /> },
    { name: "User List", path: "/seller/dashboard/user-list", icon: <FiUsers className="w-5 h-5" /> },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/seller/logout");
      if (data.success) {
        toast.success(data.message || "Logged out successfully");
        setIsSeller(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  const isActive = (path) => {
    if (path === "/seller/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
          {/* Logo/Header */}
          <div className="flex items-center justify-center h-20 bg-gradient-to-r from-green-600 to-green-700 shadow-md">
            <div className="text-center">
              <h1 className="text-white text-xl font-bold">Kisan Mart</h1>
              <p className="text-green-100 text-xs mt-1">Admin Panel</p>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                {sellerProfile?.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {sellerProfile?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {sellerProfile?.email || "admin@kisanmart.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {sidebarLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/seller/dashboard"}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-green-50 text-green-700 shadow-sm border-l-4 border-green-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                  }`}
                >
                  <span className={`mr-3 ${active ? "text-green-600" : "text-gray-500"}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              );
            })}

            <div className="pt-4 border-t border-gray-200 mt-4">
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 group"
              >
                <FiLogOut className="mr-3 w-5 h-5 text-gray-500 group-hover:text-red-600" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              © 2024 Kisan Mart Admin
            </p>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-lg text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform">
            {/* Mobile Header */}
            <div className="flex items-center justify-center h-20 bg-gradient-to-r from-green-600 to-green-700">
              <div className="text-center">
                <h1 className="text-white text-xl font-bold">Kisan Mart</h1>
                <p className="text-green-100 text-xs mt-1">Admin Panel</p>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
              {sidebarLinks.map((item) => {
                const active = isActive(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/seller/dashboard"}
                    className={`flex items-center px-4 py-3 rounded-lg ${
                      active
                        ? "bg-green-50 text-green-700 border-l-4 border-green-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                );
              })}

              <div className="pt-4 border-t border-gray-200 mt-4">
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FiLogOut className="mr-3 w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
