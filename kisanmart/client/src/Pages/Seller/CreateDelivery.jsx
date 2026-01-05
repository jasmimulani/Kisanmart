import React, { useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";

const CreateDelivery = () => {
  const { createDeliveryByAdmin } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [autoGen, setAutoGen] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePassword = () => Math.random().toString(36).slice(-8);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const finalPassword = autoGen ? generatePassword() : password;
      const payload = { name, email, phone };
      if (finalPassword) payload.password = finalPassword;

      const data = await createDeliveryByAdmin(payload);
      setResult(data);
      toast.success("Delivery boy created");
    } catch (error) {
      toast.error(error.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const copy = (text) => navigator.clipboard.writeText(text) && toast.success("Copied!");

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Delivery Boy</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="autogen"
            type="checkbox"
            checked={autoGen}
            onChange={(e) => setAutoGen(e.target.checked)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="autogen" className="text-gray-700">Auto-generate password</label>
        </div>

        {!autoGen && (
          <div>
            <label className="block mb-1 font-medium text-gray-700">Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-semibold transition-colors ${
            loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>

      {result && (
        <div className="mt-6 border border-gray-200 p-4 rounded-md bg-gray-50 space-y-2">
          <div className="flex items-center justify-between">
            <span>
              <strong>Temp password:</strong> {result.tempPassword}
            </span>
            <button
              className="px-2 py-1 text-sm border rounded hover:bg-gray-200 transition"
              onClick={() => copy(result.tempPassword)}
            >
              Copy
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <span>
              Claim link:{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href={`/delivery/claim?token=${result.token}`}
                className="text-green-600 hover:underline"
              >
                Open claim link
              </a>
            </span>
            <button
              className="px-2 py-1 text-sm border rounded hover:bg-gray-200 transition"
              onClick={() => copy(`${window.location.origin}/delivery/claim?token=${result.token}`)}
            >
              Copy link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateDelivery;
