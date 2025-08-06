// src/CreateProfile.tsx
import React from 'react'

export default function CreateProfileOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
      }}
    >
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#111',
          borderRadius: '12px',
          border: '1px solid #00ffcc',
        }}
      >
        <h2>Create Profile Overlay</h2>
        <p>This is a placeholder. Add your form components here later.</p>
      </div>
    </div>
  )
}
