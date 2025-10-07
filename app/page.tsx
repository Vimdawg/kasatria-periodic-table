'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    google: any
  }
}

interface GoogleUser {
  credential: string
  select_by: string
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const initializeGoogleSignIn = useCallback(() => {
    if (!window.google) return

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) {
      console.error('Google Client ID not found')
      setIsLoading(false)
      return
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: false
    })

    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      {
        theme: 'outline',
        size: 'large',
        width: 300,
        text: 'signin_with',
        shape: 'rectangular'
      }
    )

    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Check if user is already authenticated
    const authState = localStorage.getItem('googleAuth')
    if (authState) {
      setIsAuthenticated(true)
      router.push('/scene')
      return
    }

    // Load Google Identity Services
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      initializeGoogleSignIn()
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [router, initializeGoogleSignIn])

  const handleCredentialResponse = (response: GoogleUser) => {
    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]))
      
      const userProfile = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        credential: response.credential
      }

      // Store auth state in localStorage
      localStorage.setItem('googleAuth', JSON.stringify(userProfile))
      setIsAuthenticated(true)
      router.push('/scene')
    } catch (error) {
      console.error('Error processing Google sign-in:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Kasatria
            </h1>
            <h2 className="text-xl text-blue-200 mb-4">
              Periodic Table
            </h2>
            <p className="text-gray-300 text-sm">
              Sign in with Google to access the interactive 3D visualization
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div id="google-signin-button"></div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-xs">
              By signing in, you agree to our terms of service and privacy policy
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Powered by Google Identity Services
          </p>
        </div>
      </div>
    </div>
  )
}

