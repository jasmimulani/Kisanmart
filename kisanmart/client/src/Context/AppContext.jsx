import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [sellerProfile, setSellerProfile] = useState(null);

  const [isDelivery, setIsDelivery] = useState(false);
  const [deliveryProfile, setDeliveryProfile] = useState(null);

  const [showUserLogin, SetShowUserLogin] = useState(false);
  const [products, SetProducts] = useState([]);
  const [cartItems, SetCartItems] = useState({});
  const [pendingAdd, setPendingAdd] = useState(null);
  const [searchQuery, SetSearchQuery] = useState("");

  /* ---------------- AUTH ---------------- */

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        SetCartItems(data.user.cartItems || {});
      }
    } catch {
      setUser(null);
      SetCartItems({});
    }
  };

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
      setSellerProfile(data.profile || null);
    } catch {
      setIsSeller(false);
      setSellerProfile(null);
    }
  };

  const fetchDelivery = async () => {
    try {
      const { data } = await axios.get("/api/delivery/is-auth");
      setIsDelivery(data.success);
      setDeliveryProfile(data.profile || null);
    } catch {
      setIsDelivery(false);
      setDeliveryProfile(null);
    }
  };

  /* ---------------- PRODUCTS ---------------- */

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) SetProducts(data.products || []);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* ---------------- CART LOGIC ---------------- */

  const addToCart = (productId) => {
    if (!user) {
      setPendingAdd(productId);
      SetShowUserLogin(true);
      toast.error("Please login to add product");
      return;
    }

    SetCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const increaseQty = (productId) => {
    SetCartItems((prev) => ({
      ...prev,
      [productId]: prev[productId] + 1,
    }));
  };

  const decreaseQty = (productId) => {
    SetCartItems((prev) => {
      const updated = { ...prev };
      updated[productId] -= 1;
      if (updated[productId] <= 0) delete updated[productId];
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    SetCartItems((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
    toast.success("Removed from cart");
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((a, b) => a + b, 0);
  };

  const getCartAmount = () => {
    let total = 0;
    for (let id in cartItems) {
      const product = products.find((p) => p?._id === id);
      if (product) {
        total += product.offerprice * cartItems[id];
      }
    }
    return total;
  };

  /* ---------------- AUTO ADD AFTER LOGIN ---------------- */

  useEffect(() => {
    if (user && pendingAdd) {
      addToCart(pendingAdd);
      setPendingAdd(null);
    }
  }, [user]);

  /* ---------------- SYNC CART TO DB ---------------- */

  useEffect(() => {
    const syncCart = async () => {
      try {
        await axios.post("/api/cart/update", { cartItems });
      } catch (error) {
        toast.error("Cart sync failed");
      }
    };
    if (user) syncCart();
  }, [cartItems]);

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchDelivery();
    fetchProducts();
  }, []);

  const createDeliveryByAdmin = async (payload) => {
    try {
      console.log('Sending delivery creation request with payload:', payload);
      const { data } = await axios.post('/api/delivery/create', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      console.log('Delivery creation response:', data);
      if (!data.success) {
        throw new Error(data.message || 'Failed to create delivery');
      }
      return data;
    } catch (error) {
      console.error('Delivery creation error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to create delivery. Please check your admin privileges and try again.');
    }
  };

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    sellerProfile,
    isDelivery,
    setIsDelivery,
    deliveryProfile,
    setDeliveryProfile,
    showUserLogin,
    SetShowUserLogin,
    products,
    currency,

    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,

    cartItems,
    getCartCount,
    getCartAmount,

    searchQuery,
    SetSearchQuery,

    axios,
    fetchProducts,
    SetCartItems,
    createDeliveryByAdmin,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
