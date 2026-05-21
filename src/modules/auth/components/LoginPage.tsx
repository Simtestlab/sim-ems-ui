"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import LogoIcon from '@/shared/components/icons/LogoIcon'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [logoExists, setLogoExists] = useState(false)

  useEffect(() => {
    const img = new window.Image()
    img.src = '/logo.png'
    img.onload = () => setLogoExists(true)
    img.onerror = () => setLogoExists(false)
  }, [])

  const validate = () => {
    if (!email) return 'Email is required'
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email'
    if (!password) return 'Password is required'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const v = validate()
    if (v) return setError(v)
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 700))
      if (remember) sessionStorage.setItem('rememberedEmail', email)
      router.push('/system')
    } catch {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex bg-white">
      <div className="flex-1" />

      <div className="w-1/3 flex flex-col items-center justify-center px-8">
        <div className="mb-8">
          {logoExists ? (
            <Image src="/logo.png" alt="logo" width={96} height={96} className="object-contain" priority />
          ) : (
            <LogoIcon className="w-24 h-24 text-[#1ea3d8]" />
          )}
        </div>

        <form className="w-full max-w-lg" onSubmit={handleSubmit} noValidate>
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          <label htmlFor="email" className="block text-xs text-slate-600 mb-2">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder=""
            className="w-full h-14 bg-slate-50 px-4 mb-6 border border-transparent focus:outline-none focus:ring-0"
            autoComplete="email"
          />

          <label htmlFor="password" className="block text-xs text-slate-600 mb-2">Password</label>
          <div className="relative mb-6">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder=""
              className="w-full h-14 bg-slate-50 px-4 border border-transparent focus:outline-none focus:ring-0"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm text-slate-600">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-sm text-sky-500">Forgot password?</a>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded text-sm disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
