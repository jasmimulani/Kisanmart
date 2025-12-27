import React, { useEffect, useState } from 'react';
import { useAppContext } from '../Context/AppContext';
import toast from 'react-hot-toast';

const SelectDeliveryBoy = ({ onSelect, selectedDeliveryBoy, className = '' }) => {
  const { axios } = useAppContext();
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveryBoys = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/delivery/list');
        if (data.success) {
          setDeliveryBoys(data.list);
        } else {
          setError(data.message || 'Failed to fetch delivery boys');
          toast.error(data.message || 'Failed to fetch delivery boys');
        }
      } catch (error) {
        console.error('Error fetching delivery boys:', error);
        setError(error.message || 'An error occurred');
        toast.error(error.message || 'Failed to load delivery boys');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryBoys();
  }, [axios]);

  const handleSelect = (e) => {
    const selectedId = e.target.value;
    const selected = deliveryBoys.find(db => db._id === selectedId);
    if (selected && onSelect) {
      onSelect(selected);
    }
  };

  if (loading) {
    return <div className={`${className} p-2`}>Loading delivery boys...</div>;
  }

  if (error) {
    return (
      <div className={`${className} p-2 text-red-500`}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Delivery Boy
      </label>
      <select
        value={selectedDeliveryBoy?._id || ''}
        onChange={handleSelect}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
      >
        <option value="">-- Select a delivery boy --</option>
        {deliveryBoys.map((deliveryBoy) => (
          <option key={deliveryBoy._id} value={deliveryBoy._id}>
            {deliveryBoy.name} - {deliveryBoy.email}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectDeliveryBoy;
