'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Zap, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (_data: LoginForm) => {
    setLoading(true)
    setError(null)
    // Mock auth: set session cookie and redirect
    // When Supabase is ready, replace with:
    // const { error } = await supabase.auth.signInWithPassword({ email, password })
    await new Promise(r => setTimeout(r, 1200))
    document.cookie = 'temtech-session=mock; path=/; max-age=86400'
    router.push('/dashboard')
  }

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
        {/* Card */}
        <div className="glass-card p-8 shadow-modal">
          {/* Logo */}
          <div className="text-center mb-8">
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
            <p className="text-sm text-[#94A3B8] mt-2">
              Inicia sesión en tu dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-[#94A3B8]">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B6A8A]" />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@temtech.studio"
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
              <label htmlFor="password" className="block text-sm font-medium text-[#94A3B8]">
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

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-sm text-[#EF4444]"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed glow-cyan mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-3 rounded-xl bg-[#06B6D4]/5 border border-[#06B6D4]/20">
            <p className="text-xs text-[#94A3B8] text-center">
              <span className="text-[#06B6D4] font-medium">Demo:</span> Cualquier email y contraseña (min. 6 chars)
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#4B6A8A] mt-6">
          © 2026 TEMTECH Studio. Todos los derechos reservados.
        </p>
      </motion.div>
    </div>
  )
}
