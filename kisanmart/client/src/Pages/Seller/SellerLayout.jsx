import React from "react";
import { useAppContext } from "../../Context/AppContext";
import { assets } from "../../assets/assets";
import { NavLink, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

const SellerLayout = () => {
  const { axios, navigate, setIsSeller, sellerProfile } = useAppContext();

  const sidebarLinks = [
    { name: "Admin Profile", path: "/seller/dashboard", icon: assets.profile_icon },
    { name: "Add Product", path: "/seller/dashboard/add-product", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/seller/dashboard/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/dashboard/orders", icon: assets.order_icon },
    { name: "Delivery List", path: "/seller/dashboard/delivery-list", icon: assets.product_list_icon },
    { name: "Create Delivery", path: "/seller/dashboard/create-delivery", icon: assets.add_icon },
    { name: "User List", path: "/seller/dashboard/user-list", icon: assets.product_list_icon },
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

  return (
    <>
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <NavLink to="/" className="text-accent text-3xl font-bold">
          Kisan<span className="text-green-500">Mart</span>
        </NavLink>

        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! {sellerProfile?.name || "Admin"}</p>
          <button
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1"
          >
            Logout
          </button>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="flex">
        {/* SIDEBAR */}
        <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col">
          {sidebarLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/seller/dashboard"}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 gap-3 ${
                  isActive
                    ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                    : "hover:bg-gray-100/90 border-white text-gray-700"
                }`
              }
            >
              <img src={item.icon} alt="" className="w-7 h-7" />
              <p className="md:block hidden">{item.name}</p>
            </NavLink>
          ))}
        </div>

        {/* PAGE CONTENT */}
        <Outlet />
      </div>
    </>
  );
};

export default SellerLayout;
