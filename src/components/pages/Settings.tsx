import { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Palette,
  Save,
  Camera,
  Eye,
  EyeOff,
  Check,
  Globe,
  Sun,
  Moon,
} from 'lucide-react';
import { currentUser } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';

export default function Settings() {
  const { t, theme, setTheme, language, setLanguage } = useApp();
  const isDark = theme === 'dark';

  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    bio: currentUser.bio,
    emailNotifs: true,
    pushNotifs: true,
    weeklyDigest: true,
    courseUpdates: true,
    forumReplies: true,
    twoFactor: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: 'profile', label: t('settings.profile'), icon: User },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell },
    { id: 'security', label: t('settings.security'), icon: Shield },
    { id: 'preferences', label: t('settings.preferences'), icon: Palette },
  ];

  return (
    <div className={`p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('settings.title')}</h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('settings.subtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className={`rounded-2xl border p-2 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : isDark
                      ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${activeSection === section.id ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className={`rounded-2xl border p-6 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('settings.profile')}</h2>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-2xl font-bold text-white">
                      {form.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <button className={`absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full shadow-md ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-slate-50'}`}>
                      <Camera className={`h-3.5 w-3.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
                    </button>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('settings.profilePhoto')}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('settings.photoFormats')}</p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={`mb-1.5 block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{t('settings.fullName')}</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className={`h-10 w-full rounded-xl border px-4 text-sm outline-none transition-all ${
                        isDark
                          ? 'border-slate-600 bg-slate-700 text-white focus:border-primary-500'
                          : 'border-slate-200 bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`mb-1.5 block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{t('settings.email')}</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className={`h-10 w-full rounded-xl border px-4 text-sm outline-none transition-all ${
                        isDark
                          ? 'border-slate-600 bg-slate-700 text-white focus:border-primary-500'
                          : 'border-slate-200 bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`mb-1.5 block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{t('settings.bio')}</label>
                  <textarea
                    value={form.bio}
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                      isDark
                        ? 'border-slate-600 bg-slate-700 text-white focus:border-primary-500'
                        : 'border-slate-200 bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100'
                    }`}
                  />
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('settings.notifications')}</h2>
                {[
                  { key: 'emailNotifs' as const, label: t('settings.emailNotifications'), desc: t('settings.emailNotificationsDesc') },
                  { key: 'pushNotifs' as const, label: t('settings.pushNotifications'), desc: t('settings.pushNotificationsDesc') },
                  { key: 'weeklyDigest' as const, label: t('settings.weeklyDigest'), desc: t('settings.weeklyDigestDesc') },
                  { key: 'courseUpdates' as const, label: t('settings.courseUpdates'), desc: t('settings.courseUpdatesDesc') },
                  { key: 'forumReplies' as const, label: t('settings.forumReplies'), desc: t('settings.forumRepliesDesc') },
                ].map((item) => (
                  <div key={item.key} className={`flex items-center justify-between rounded-xl border p-4 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.label}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setForm({ ...form, [item.key]: !form[item.key] })}
                      className={`relative h-6 w-11 rounded-full transition-all ${
                        form[item.key] ? 'bg-primary-600' : isDark ? 'bg-slate-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                          form[item.key] ? 'left-[22px]' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('settings.security')}</h2>

                <div>
                  <label className={`mb-1.5 block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{t('settings.currentPassword')}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="********"
                      className={`h-10 w-full rounded-xl border px-4 pr-10 text-sm outline-none transition-all ${
                        isDark
                          ? 'border-slate-600 bg-slate-700 text-white focus:border-primary-500'
                          : 'border-slate-200 bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={`mb-1.5 block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{t('settings.newPassword')}</label>
                    <input
                      type="password"
                      placeholder="********"
                      className={`h-10 w-full rounded-xl border px-4 text-sm outline-none transition-all ${
                        isDark
                          ? 'border-slate-600 bg-slate-700 text-white focus:border-primary-500'
                          : 'border-slate-200 bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`mb-1.5 block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{t('settings.confirmPassword')}</label>
                    <input
                      type="password"
                      placeholder="********"
                      className={`h-10 w-full rounded-xl border px-4 text-sm outline-none transition-all ${
                        isDark
                          ? 'border-slate-600 bg-slate-700 text-white focus:border-primary-500'
                          : 'border-slate-200 bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                  </div>
                </div>

                <div className={`flex items-center justify-between rounded-xl border p-4 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('settings.twoFactor')}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('settings.twoFactorDesc')}</p>
                  </div>
                  <button
                    onClick={() => setForm({ ...form, twoFactor: !form.twoFactor })}
                    className={`relative h-6 w-11 rounded-full transition-all ${
                      form.twoFactor ? 'bg-primary-600' : isDark ? 'bg-slate-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                        form.twoFactor ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'preferences' && (
              <div className="space-y-6">
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('settings.preferences')}</h2>

                {/* Theme */}
                <div>
                  <label className={`mb-2 block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{t('settings.theme')}</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-4 transition-all ${
                        theme === 'light'
                          ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                          : isDark
                          ? 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Sun className="h-5 w-5" />
                      <span className="text-sm font-medium">{t('settings.lightMode')}</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-4 transition-all ${
                        theme === 'dark'
                          ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                          : isDark
                          ? 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Moon className="h-5 w-5" />
                      <span className="text-sm font-medium">{t('settings.darkMode')}</span>
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className={`mb-2 flex items-center gap-2 text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    <Globe className="h-4 w-4" /> {t('settings.language')}
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setLanguage('fr')}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-4 transition-all ${
                        language === 'fr'
                          ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                          : isDark
                          ? 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-lg">FR</span>
                      <span className="text-sm font-medium">Francais</span>
                    </button>
                    <button
                      onClick={() => setLanguage('en')}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-4 transition-all ${
                        language === 'en'
                          ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                          : isDark
                          ? 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-lg">EN</span>
                      <span className="text-sm font-medium">English</span>
                    </button>
                  </div>
                </div>

                {/* Timezone */}
                <div>
                  <label className={`mb-1.5 block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{t('settings.timezone')}</label>
                  <select
                    className={`h-10 w-full rounded-xl border px-4 text-sm outline-none transition-all ${
                      isDark
                        ? 'border-slate-600 bg-slate-700 text-white focus:border-primary-500'
                        : 'border-slate-200 bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100'
                    }`}
                  >
                    <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                    <option value="Europe/London">Europe/London (UTC+0)</option>
                    <option value="America/New_York">America/New_York (UTC-5)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className={`mt-6 flex items-center justify-end gap-3 border-t pt-4 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
              {saved && (
                <span className="flex items-center gap-1 text-sm font-medium text-success-600">
                  <Check className="h-4 w-4" /> {t('settings.saved')}
                </span>
              )}
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary-200 hover:bg-primary-700 dark:shadow-none"
              >
                <Save className="h-4 w-4" /> {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
