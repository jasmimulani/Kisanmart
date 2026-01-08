import React, { useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";

const DeliveryLogin = () => {
  const { setIsDelivery, navigate, axios } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/delivery/login", {
        email,
        password,
      });

      if (data.success) {
        toast.success("Login successful");
        setIsDelivery(true);
        navigate("/delivery/dashboard"); // ✅ DIRECT NAV
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-screen flex items-center text-sm text-gray-600"
    >
      <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 rounded-lg shadow-xl border">
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">Delivery</span> Login
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full p-2 mt-1"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded w-full p-2 mt-1"
            required
          />
        </div>

        <button className="bg-primary text-white w-full py-2 rounded">
          Login
        </button>
      </div>
    </form>
  );
};

export default DeliveryLogin;
