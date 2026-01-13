import React from "react";
import { useAppContext } from "../../Context/AppContext";

const Profile = () => {
  const { deliveryProfile } = useAppContext();

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="w-16 h-16 rounded-full bg-green-700 text-white flex items-center justify-center text-2xl font-bold">
            {deliveryProfile?.name
              ? deliveryProfile.name.charAt(0).toUpperCase()
              : "D"}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-green-700">
              {deliveryProfile?.name || "Delivery Partner"}
            </h2>
            <p className="text-sm text-gray-500">
              Delivery Executive
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">
              📧 Email
            </span>
            <span className="text-gray-800 text-sm">
              {deliveryProfile?.email || "-"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">
              📞 Phone
            </span>
            <span className="text-gray-800 text-sm">
              {deliveryProfile?.phone || "-"}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
