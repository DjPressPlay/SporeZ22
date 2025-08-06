// src/CreateProfile.tsx
import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function CreateProfile() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')

  const handleCreateProfile = async () => {
    if (!name || !password) {
      setStatus('Name and password are required.')
      return
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, password }]) // plaintext for now

    if (error) {
      setStatus(`Error: ${error.message}`)
    } else {
      setStatus('Profile created successfully!')
      setName('')
      setPassword('')
    }
  }

  return (
    <div>
      <h2>Create Profile</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleCreateProfile}>Create Profile</button>
      {status && <p>{status}</p>}
    </div>
  )
}
