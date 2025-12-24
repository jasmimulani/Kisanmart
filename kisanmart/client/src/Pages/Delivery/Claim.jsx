import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../Context/AppContext'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'

const Claim = () => {
  const { axios } = useAppContext()
  const navigate = useNavigate()
  const loc = useLocation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(loc.search)
    const token = params.get('token')
    if (!token) {
      toast.error('No token provided')
      navigate('/delivery/login')
      return
    }

    const claim = async () => {
      try {
        setLoading(true)
        const { data } = await axios.post('/api/delivery/claim', { token })
        if (data.success) {
          toast.success('Logged in')
          navigate('/delivery/dashboard')
        } else {
          toast.error(data.message)
          navigate('/delivery/login')
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message)
        navigate('/delivery/login')
      } finally { setLoading(false) }
    }

    claim()
  }, [])

  if (loading) return <div className="p-6">Claiming token...</div>

  return null
}

export default Claim
