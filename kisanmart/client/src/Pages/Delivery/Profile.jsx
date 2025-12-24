import React from 'react'
import { useAppContext } from '../../Context/AppContext'

const Profile = () => {
  const { deliveryProfile } = useAppContext()

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Delivery Profile</h2>
      <div className="mt-4">
        <p><strong>Name:</strong> {deliveryProfile?.name}</p>
        <p><strong>Email:</strong> {deliveryProfile?.email}</p>
        <p><strong>Phone:</strong> {deliveryProfile?.phone || '-'}</p>
      </div>
    </div>
  )
}

export default Profile
