import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAppContext } from '../../Context/AppContext'
import toast from 'react-hot-toast'

const DeliveryLayout = () => {
  const { axios, navigate, setIsDelivery, deliveryProfile, setDeliveryProfile } = useAppContext()

  const links = [
    { name: 'Profile', path: '/delivery/dashboard' },
    { name: 'Orders', path: '/delivery/dashboard/orders' },
  ]

  const logout = async () => {
    try {
      const { data } = await axios.post('/api/delivery/logout')
      if (data.success) {
        toast.success(data.message)
        setIsDelivery(false)
        setDeliveryProfile(null)
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white ">
        <NavLink to="/" className="text-accent text-3xl font-bold">Kisan<span className="text-green-500">Mart</span></NavLink>
        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! {deliveryProfile?.name || 'Delivery'}</p>
          <button onClick={logout} className="border rounded-full text-sm px-4 py-1">Logout</button>
        </div>
      </div>
      <div className="flex">
        <div className="md:w-56 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col ">
          {links.map((item) => (
            <NavLink key={item.name} to={item.path} className={({isActive})=>`flex items-center py-3 px-4 gap-3 ${isActive? 'bg-primary/10 border-r-4 border-primary text-primary' : 'hover:bg-gray-100 text-gray-700'}`}>
              <p className="md:block hidden">{item.name}</p>
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </>
  )
}

export default DeliveryLayout
