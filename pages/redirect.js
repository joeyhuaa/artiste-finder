import React, { useEffect } from 'react'

export default function Redirect() {
  useEffect(() => {
    fetch('https://api.genius.com/oauth/token', {
      method: 'POST',
      body: JSON.stringify({
        code: '',
        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        
      })
    })
  }, [])
  return (
    <h1>Auth redirecting...</h1>
  )
}