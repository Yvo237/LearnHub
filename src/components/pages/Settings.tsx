import { useState, useEffect } from 'react';
import { Bell, Globe, Shield, Palette, ChevronRight, Save } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { userService } from '../../lib/supabase';

export default function Settings() {
  const { t, theme, user } = useApp();
  const [form, setForm] = useState({ name: '', email: '', bio: '' });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (user) {
      setForm({ name: user.fullName, email: user.email, bio: '' });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await userService.updateProfile(user.id, { full_name: form.name, bio: form.bio });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    {
      title: t('settings.profile'),
      items: [
        { label: t('settings.fullName'), type: 'text', value: form.name, onChange: (v: string) => setForm(f => ({ ...f, name: v })) },
        { label: t('settings.email'), type: 'text', value: form.email, onChange: (v: string) => setForm(f => ({ ...f, email: v })), disabled: true },
        { label: t('settings.bio'), type: 'textarea', value: form.bio, onChange: (v: string) => setForm(f => ({ ...f, bio: v })) },
      ],
    },
  ];

  return (
    <div className={`p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('nav.settings')}</h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('settings.subtitle')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className={`rounded-2xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <nav className="space-y-0.5 p-2">
            {[
              { icon: Palette, label: t('settings.appearance'), desc: t('settings.appearanceDesc') },
              { icon: Bell, label: t('settings.notifications'), desc: t('settings.notifDesc') },
              { icon: Globe, label: t('settings.language'), desc: t('settings.langDesc') },
              { icon: Shield, label: t('settings.privacy'), desc: t('settings.privacyDesc') },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button key={idx} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    <Icon className={`h-5 w-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.label}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                  </div>
                  <ChevronRight className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </nav>
        </div>

        <div className={`rounded-2xl border md:col-span-2 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <div className={`border-b px-6 py-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('settings.profile')}</h2>
          </div>
          {sections[0].items.map((item, idx) => (
            <div key={idx} className={`border-b px-6 py-4 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
              <label className={`mb-1.5 block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.label}</label>
              {item.type === 'textarea' ? (
                <textarea value={item.value} onChange={e => item.onChange(e.target.value)} rows={3}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${isDark ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20' : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100'}`} />
              ) : (
                <input type="text" value={item.value} onChange={e => item.onChange(e.target.value)} disabled={item.disabled}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${isDark ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20' : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100'} ${item.disabled ? 'opacity-60' : ''}`} />
              )}
            </div>
          ))}
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              {saved && <span className={`text-sm font-medium ${isDark ? 'text-success-400' : 'text-success-600'}`}>{t('settings.saved')}</span>}
            </div>
            <div className="flex gap-3">
              <button className={`rounded-xl border px-5 py-2 text-sm font-medium transition-colors ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{t('common.cancel')}</button>
              <button onClick={handleSave} disabled={saving}
                className={`flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 ${saving ? 'opacity-60' : ''}`}>
                <Save className="h-4 w-4" /> {saving ? t('common.saving') : t('common.save')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
