'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Zap, Eye, EyeOff, Loader2, Lock, Mail, UserPlus, LogIn, CheckCircle2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard'

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    if (mode === 'signin') {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        setLoading(false)
        if (authError.message.includes('Invalid login credentials')) {
          setError('Correo o contraseña incorrectos.')
        } else {
          setError(authError.message)
        }
        return
      }

      router.push(redirectPath)
      router.refresh()
    } else {
      // Sign Up
      const { data: signUpData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      setLoading(false)

      if (authError) {
        setError(authError.message)
        return
      }

      if (signUpData.session) {
        router.push(redirectPath)
        router.refresh()
      } else {
        setSuccessMessage('¡Cuenta creada con éxito! Inicia sesión con tus credenciales.')
        setMode('signin')
      }
    }
  }

  return (
    <div className="glass-card p-8 shadow-modal">
      {/* Logo */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] glow-cyan mb-4"
        >
          <Zap className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-2xl font-display font-bold text-white">
          TEM<span className="gradient-text-cyan">TECH</span> Studio
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          {mode === 'signin' ? 'Acceso al Dashboard CRM' : 'Crear nueva cuenta'}
        </p>
      </div>

      {/* Mode switch tabs */}
      <div className="flex bg-[#0F172A] p-1 rounded-xl mb-6 border border-[#1E2A3A]">
        <button
          type="button"
          onClick={() => { setMode('signin'); setError(null); setSuccessMessage(null) }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mode === 'signin'
              ? 'bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white shadow-sm'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" /> Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={() => { setMode('signup'); setError(null); setSuccessMessage(null) }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mode === 'signup'
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-sm'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" /> Registrarse
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold text-[#94A3B8]">
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B6A8A]" />
            <input
              id="email"
              type="email"
              placeholder="usuario@temtech.studio"
              {...register('email')}
              className="w-full bg-[#111827] border border-[#1E2A3A] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#4B6A8A] focus:outline-none focus:border-[#06B6D4]/60 focus:ring-1 focus:ring-[#06B6D4]/20 transition-all"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-[#EF4444]">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-xs font-semibold text-[#94A3B8]">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B6A8A]" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className="w-full bg-[#111827] border border-[#1E2A3A] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-[#4B6A8A] focus:outline-none focus:border-[#06B6D4]/60 focus:ring-1 focus:ring-[#06B6D4]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B6A8A] hover:text-[#94A3B8] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-[#EF4444]">{errors.password.message}</p>
          )}
        </div>

        {/* Success message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-xs text-[#22C55E] flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-xs text-[#EF4444]"
          >
            {error}
          </motion.div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2 ${
            mode === 'signin'
              ? 'bg-gradient-to-r from-[#06B6D4] to-[#0891B2] glow-cyan'
              : 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] glow-violet'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {mode === 'signin' ? 'Iniciando sesión...' : 'Creando cuenta...'}
            </>
          ) : mode === 'signin' ? (
            'Iniciar sesión'
          ) : (
            'Crear cuenta'
          )}
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#080B14] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#06B6D4]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#8B5CF6]/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#06B6D4]/3 blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#06B6D4 1px, transparent 1px), linear-gradient(90deg, #06B6D4 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <Suspense fallback={<div className="glass-card p-8 text-center text-white">Cargando...</div>}>
          <LoginFormContent />
        </Suspense>

        <p className="text-center text-xs text-[#4B6A8A] mt-6">
          © 2026 TEMTECH Studio. Conectado a Supabase Auth.
        </p>
      </motion.div>
    </div>
  )
}
