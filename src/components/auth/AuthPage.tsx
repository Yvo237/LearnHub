import { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function AuthPage() {
  const { t, theme, signIn, signUp } = useApp();
  const isDark = theme === 'dark';

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (form.password !== form.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          setLoading(false);
          return;
        }
        if (form.password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caracteres');
          setLoading(false);
          return;
        }
        const { error } = await signUp(form.email, form.password, form.fullName);
        if (error) {
          setError(error.message);
        }
      } else {
        const { error } = await signIn(form.email, form.password);
        if (error) {
          setError(error.message);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-learning.jpg')] opacity-10 bg-cover bg-center" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">LearnHub</span>
          </div>
        </div>
        
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Developpez vos competences avec les meilleurs cours en ligne
          </h1>
          <p className="text-lg text-primary-100">
            Rejoignez plus de 50 000 apprenants et accedez a des centaines de cours de qualite professionnelle.
          </p>
          <div className="flex items-center gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-primary-200">Cours</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">50K+</p>
              <p className="text-sm text-primary-200">Apprenants</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-sm text-primary-200">Satisfaction</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-primary-200">
            Plateforme d'apprentissage nouvelle generation
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute bottom-32 right-12 h-32 w-32 rounded-full bg-white/5" />
      </div>

      {/* Right Panel - Form */}
      <div className={`flex flex-1 items-center justify-center p-6 lg:p-12 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-3 lg:hidden mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-600">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>LearnHub</span>
          </div>

          <div className="text-center mb-8">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {mode === 'signin' ? t('auth.signIn') : t('auth.signUp')}
            </h2>
            <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {mode === 'signin' 
                ? 'Connectez-vous pour acceder a vos cours'
                : 'Creez un compte pour commencer a apprendre'
              }
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className={`mb-6 flex items-center gap-3 rounded-xl p-4 ${isDark ? 'bg-danger-900/30 text-danger-400' : 'bg-danger-50 text-danger-600'}`}>
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name - Only for signup */}
            {mode === 'signup' && (
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {t('settings.fullName')}
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                    placeholder="Jean Dupont"
                    className={`h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition-all ${
                      isDark
                        ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                        : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className={`mb-1.5 block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="vous@exemple.com"
                  className={`h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition-all ${
                    isDark
                      ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                      : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`mb-1.5 block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  placeholder="********"
                  className={`h-12 w-full rounded-xl border pl-11 pr-11 text-sm outline-none transition-all ${
                    isDark
                      ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                      : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password - Only for signup */}
            {mode === 'signup' && (
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {t('settings.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                    placeholder="********"
                    className={`h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition-all ${
                      isDark
                        ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                        : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Forgot Password - Only for signin */}
            {mode === 'signin' && (
              <div className="flex justify-end">
                <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  {t('auth.forgotPassword')}
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/30 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? t('auth.signIn') : t('auth.signUp')}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <p className={`mt-6 text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {mode === 'signin' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
              }}
              className="font-semibold text-primary-600 hover:text-primary-700"
            >
              {mode === 'signin' ? t('auth.signUp') : t('auth.signIn')}
            </button>
          </p>

          {/* Demo mode notice */}
          <div className={`mt-8 rounded-xl border p-4 ${isDark ? 'border-emerald-800 bg-emerald-900/30' : 'border-emerald-200 bg-emerald-50'}`}>
            <p className={`text-xs font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Mode demonstration actif</p>
            <p className={`mt-1 text-xs ${isDark ? 'text-emerald-300/70' : 'text-emerald-600'}`}>
              Entrez n'importe quel email et mot de passe pour acceder a l'application. Les donnees sont stockees localement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
