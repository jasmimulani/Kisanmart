import React, { useState } from 'react'
import { useAppContext } from '../../Context/AppContext'
import toast from 'react-hot-toast'

const DeliveryRegister = () => {
  const { axios, navigate } = useAppContext()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data } = await axios.post('/api/delivery/register', { name, email, password, phone })
      if (data.success) {
        toast.success('Registered and logged in')
        navigate('/delivery/dashboard')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={onSubmit} className="min-h-screen flex items-center text-sm text-gray-600">
      <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
        <p className="text-2xl font-medium m-auto"><span className="text-primary">Delivery</span> Register</p>
        <div className="w-full">
          <p>Name</p>
          <input value={name} onChange={(e)=>setName(e.target.value)} required className="border p-2 rounded w-full" />
        </div>
        <div className="w-full">
          <p>Email</p>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required className="border p-2 rounded w-full" />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required className="border p-2 rounded w-full" />
        </div>
        <div className="w-full">
          <p>Phone</p>
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="border p-2 rounded w-full" />
        </div>
        <button disabled={loading} className="bg-primary text-white w-full py-2 rounded-md">{loading ? 'Registering...' : 'Register'}</button>
      </div>
    </form>
  )
}

export default DeliveryRegister
