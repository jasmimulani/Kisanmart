import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../Context/AppContext'
import toast from 'react-hot-toast'

const DeliveryList = () => {
  const { axios } = useAppContext()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  const fetch = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/delivery/list')
      if (data.success) setList(data.list)
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
    finally { setLoading(false) }
  }

  useEffect(()=>{ fetch() }, [])

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Delivery Boys</h2>
      {loading ? <div>Loading...</div> : (
        <div className="flex flex-col gap-3">
          {list.length === 0 ? <p>No delivery boys yet</p> : list.map(d=> (
            <div key={d._id} className="border p-3 rounded flex justify-between items-center">
              <div>
                <p className="font-medium">{d.name}</p>
                <p className="text-sm">{d.email}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>navigator.clipboard.writeText(d.email)} className="border px-3 py-1 rounded">Copy Email</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DeliveryList
