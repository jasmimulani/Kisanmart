import React, { useState } from 'react'
import { useAppContext } from '../../Context/AppContext'
import toast from 'react-hot-toast'

const CreateDelivery = () => {
  const { createDeliveryByAdmin } = useAppContext()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [autoGen, setAutoGen] = useState(true)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const generatePassword = () => Math.random().toString(36).slice(-8)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const finalPassword = autoGen ? generatePassword() : password
      const payload = { name, email, phone }
      if (finalPassword) payload.password = finalPassword

      const data = await createDeliveryByAdmin(payload)
      setResult(data)
      toast.success('Delivery boy created')
    } catch (error) { toast.error(error.message || 'Failed') }
    finally { setLoading(false) }
  }

  const copy = (text) => navigator.clipboard.writeText(text)

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create Delivery Boy</h2>
      <form onSubmit={onSubmit} className="max-w-md">
        <div className="mb-3">
          <p>Name</p>
          <input value={name} onChange={(e)=>setName(e.target.value)} className="border p-2 rounded w-full" required />
        </div>
        <div className="mb-3">
          <p>Email</p>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="border p-2 rounded w-full" required />
        </div>
        <div className="mb-3">
          <p>Phone</p>
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="border p-2 rounded w-full" />
        </div>

        <div className="mb-3 flex items-center gap-3">
          <input id="autogen" type="checkbox" checked={autoGen} onChange={(e)=>setAutoGen(e.target.checked)} />
          <label htmlFor="autogen">Auto-generate password</label>
        </div>

        {!autoGen && (
          <div className="mb-3">
            <p>Password</p>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="text" className="border p-2 rounded w-full" />
          </div>
        )}

        <button disabled={loading} className="bg-primary text-white px-4 py-2 rounded">{loading ? 'Creating...' : 'Create'}</button>
      </form>

      {result && (
        <div className="mt-6 border p-4 rounded">
          <p className="mb-2"><strong>Temp password:</strong> <span className="ml-2">{result.tempPassword}</span>
            <button className="ml-3 px-2 py-1 border rounded" onClick={()=>copy(result.tempPassword)}>Copy</button>
          </p>
          <p className="mt-2">Claim link: <a target="_blank" rel="noreferrer" href={`/delivery/claim?token=${result.token}`} className="text-primary">Open claim link</a>
            <button className="ml-3 px-2 py-1 border rounded" onClick={()=>copy(`${window.location.origin}/delivery/claim?token=${result.token}`)}>Copy link</button>
          </p>
        </div>
      )}
    </div>
  )
}

export default CreateDelivery
