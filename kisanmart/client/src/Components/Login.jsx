import React from "react";
import { useAppContext } from "../Context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { SetShowUserLogin, setUser, axios, navigate } = useAppContext();

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      // Client-side validation: email must contain '@' and end with '.com'
      const emailLower = String(email || "").trim().toLowerCase();
      if (!emailLower.includes("@") || !emailLower.endsWith(".com")) {
        toast.error("Please enter a valid email that contains '@' and ends with '.com'");
        return;
      }

      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email: emailLower,
        password,
      });
      if (data.success) {
        navigate("/");
        setUser(data.user);
        SetShowUserLogin(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    SetShowUserLogin(false);
  };

  return (
    <div
      onClick={() => SetShowUserLogin(false)}
      className="fixed inset-0 z-60 flex items-center text-sm text-gray-600 bg-black/60"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-6 sm:p-8 py-10 w-80 sm:w-[420px] rounded-xl shadow-2xl border border-gray-100 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>
        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 focus:ring-2 focus:ring-green-200 outline-none"
              type="text"
              required
            />
          </div>
        )}
        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 focus:ring-2 focus:ring-green-200 outline-none"
            type="email"
            required
          />
        </div>
        <div className="w-full ">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 focus:ring-2 focus:ring-green-200 outline-none"
            type="password"
            required
          />
        </div>
        {state === "register" ? (
          <p>
            Already have account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        )}
        <button className="w-full py-2 rounded-md text-white font-medium transition"
          style={{ background: 'linear-gradient(90deg,#16a34a,#059669)' }}
        >
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
