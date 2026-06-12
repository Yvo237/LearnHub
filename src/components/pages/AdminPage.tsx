import { useState, useEffect } from 'react';
import { LayoutDashboard, BookOpen, Users, BarChart3, Plus, Pencil, Trash2, X, Check, Shield, Loader2, Search, Tag } from 'lucide-react';
import { adminService } from '../../lib/supabase';
import { useApp } from '../../contexts/AppContext';
import type { Page } from '../../types';

interface AdminPageProps {
  onNavigate: (page: Page) => void;
}

type Tab = 'overview' | 'courses' | 'users';

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const { t, theme, user } = useApp();
  const isDark = theme === 'dark';
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState({ totalCourses: 0, totalUsers: 0, totalEnrollments: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') { onNavigate('dashboard'); return; }
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [statsRes, coursesRes, usersRes] = await Promise.all([
      adminService.getStats(),
      adminService.getAllCourses(),
      adminService.getAllUsers(),
    ]);
    if (statsRes.data) setStats(statsRes.data);
    setCourses(coursesRes.data || []);
    setUsers(usersRes.data || []);
    setLoading(false);
  }

  if (user?.role !== 'admin') return null;

  const tabs = [
    { id: 'overview' as Tab, label: t('admin.overview'), icon: BarChart3 },
    { id: 'courses' as Tab, label: t('admin.courses'), icon: BookOpen },
    { id: 'users' as Tab, label: t('admin.users'), icon: Users },
  ];

  return (
    <div className={`p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('admin.title')}</h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('admin.subtitle')}</p>
      </div>

      <div className={`mb-6 flex gap-1 rounded-xl border p-1 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${tab === id ? 'bg-primary-600 text-white shadow-sm' : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`}>
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className={`h-8 w-8 animate-spin ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
        </div>
      ) : tab === 'overview' ? (
        <OverviewTab stats={stats} isDark={isDark} />
      ) : tab === 'courses' ? (
        <CoursesTab courses={courses} onRefresh={loadData} isDark={isDark} />
      ) : (
        <UsersTab users={users} onRefresh={loadData} isDark={isDark} />
      )}
    </div>
  );
}

function OverviewTab({ stats, isDark }: { stats: any; isDark: boolean }) {
  const cards = [
    { label: 'admin.totalCourses', value: stats.totalCourses, icon: BookOpen, color: 'text-primary-600', bg: isDark ? 'bg-primary-900/30' : 'bg-primary-50' },
    { label: 'admin.totalUsers', value: stats.totalUsers, icon: Users, color: 'text-accent-600', bg: isDark ? 'bg-accent-900/30' : 'bg-accent-50' },
    { label: 'admin.totalEnrollments', value: stats.totalEnrollments, icon: BarChart3, color: 'text-success-600', bg: isDark ? 'bg-success-900/30' : 'bg-success-50' },
  ];
  const { t } = useApp();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <div className={`inline-flex rounded-xl ${bg} p-3`}><Icon className={`h-6 w-6 ${color}`} /></div>
          <p className={`mt-3 text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t(label)}</p>
        </div>
      ))}
    </div>
  );
}

function CoursesTab({ courses, onRefresh, isDark }: { courses: any[]; onRefresh: () => void; isDark: boolean }) {
  const { t } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', price: '', instructor_name: '', is_published: true });
  const [search, setSearch] = useState('');

  const filtered = courses.filter((c: any) => !search || c.title?.toLowerCase().includes(search.toLowerCase()));

  async function handleSave() {
    if (!editingId && !form.title) return;
    await adminService.upsertCourse(editingId ? { id: editingId, ...form, price: parseInt(form.price) || 0 } : { ...form, price: parseInt(form.price) || 0 });
    setEditingId(null);
    setForm({ title: '', description: '', category: '', price: '', instructor_name: '', is_published: true });
    onRefresh();
  }

  function startEdit(c: any) {
    setEditingId(c.id);
    setForm({ title: c.title || '', description: c.description || '', category: c.category || '', price: String(c.price || ''), instructor_name: c.instructor_name || '', is_published: c.is_published !== false });
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    await adminService.deleteCourse(id);
    onRefresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('common.search')}
            className={`h-10 w-full rounded-xl border pl-10 pr-4 text-sm outline-none ${isDark ? 'border-slate-700 bg-slate-800 text-slate-200 placeholder-slate-500 focus:border-primary-500' : 'border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100'}`} />
        </div>
        <button onClick={() => { setEditingId('new'); setForm({ title: '', description: '', category: '', price: '', instructor_name: '', is_published: true }); }}
          className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> {t('admin.addCourse')}
        </button>
      </div>

      {editingId === 'new' && (
        <CourseForm form={form} onChange={setForm} onSave={handleSave} onCancel={() => setEditingId(null)} isDark={isDark} t={t} />
      )}

      <div className="space-y-2">
        {filtered.map((c: any) => (
          <div key={c.id} className={`rounded-2xl border p-4 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
            {editingId === c.id ? (
              <CourseForm form={form} onChange={setForm} onSave={handleSave} onCancel={() => setEditingId(null)} isDark={isDark} t={t} />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.title}</h3>
                    <span className={`rounded-lg px-2 py-0.5 text-xs font-medium ${c.is_published ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                      {c.is_published ? t('admin.published') : t('admin.draft')}
                    </span>
                  </div>
                  <p className={`mt-0.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{c.category} - {c.instructor_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(c)} className={`rounded-lg p-2 ${isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'}`}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className={`rounded-lg p-2 ${isDark ? 'text-danger-400 hover:bg-danger-900/20' : 'text-danger-500 hover:bg-danger-50'}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseForm({ form, onChange, onSave, onCancel, isDark, t }: any) {
  return (
    <div className="space-y-3">
      <input value={form.title} onChange={e => onChange({ ...form, title: e.target.value })} placeholder="Titre du cours"
        className={`h-10 w-full rounded-xl border px-4 text-sm outline-none ${isDark ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-primary-500' : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-primary-300'}`} />
      <textarea value={form.description} onChange={e => onChange({ ...form, description: e.target.value })} placeholder="Description" rows={3}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none resize-none ${isDark ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-primary-500' : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-primary-300'}`} />
      <div className="grid grid-cols-3 gap-3">
        <input value={form.category} onChange={e => onChange({ ...form, category: e.target.value })} placeholder="Categorie"
          className={`h-10 rounded-xl border px-4 text-sm outline-none ${isDark ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-primary-500' : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-primary-300'}`} />
        <input value={form.instructor_name} onChange={e => onChange({ ...form, instructor_name: e.target.value })} placeholder="Instructeur"
          className={`h-10 rounded-xl border px-4 text-sm outline-none ${isDark ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-primary-500' : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-primary-300'}`} />
        <input value={form.price} onChange={e => onChange({ ...form, price: e.target.value })} placeholder="Prix (FCFA)" type="number"
          className={`h-10 rounded-xl border px-4 text-sm outline-none ${isDark ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-primary-500' : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-primary-300'}`} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.is_published} onChange={e => onChange({ ...form, is_published: e.target.checked })} className="rounded" />
        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('admin.published')}</span>
      </label>
      <div className="flex gap-2">
        <button onClick={onSave} className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          <Check className="h-4 w-4" /> {t('admin.save')}
        </button>
        <button onClick={onCancel} className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          <X className="h-4 w-4" /> {t('admin.cancel')}
        </button>
      </div>
    </div>
  );
}

function UsersTab({ users, isDark }: { users: any[]; isDark: boolean }) {
  const { t } = useApp();
  const [search, setSearch] = useState('');

  const filtered = users.filter((u: any) => !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  async function changeRole(userId: string, role: string) {
    await adminService.updateUserRole(userId, role);
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('common.search')}
          className={`h-10 w-full rounded-xl border pl-10 pr-4 text-sm outline-none ${isDark ? 'border-slate-700 bg-slate-800 text-slate-200 placeholder-slate-500 focus:border-primary-500' : 'border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100'}`} />
      </div>

      <div className="space-y-2">
        {filtered.map((u: any) => (
          <div key={u.id} className={`flex items-center justify-between rounded-2xl border p-4 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${isDark ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-100 text-primary-700'}`}>
                {(u.full_name || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{u.full_name}</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} flex items-center gap-1`}>
                  {u.email}
                  {u.role === 'admin' && <Shield className="h-3 w-3 text-amber-500" />}
                </p>
              </div>
            </div>
            <select value={u.role || 'student'} onChange={e => changeRole(u.id, e.target.value)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-medium outline-none ${isDark ? 'border-slate-600 bg-slate-700 text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
