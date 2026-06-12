import { useState, useEffect } from 'react';
import { Award, Download, Share2, Calendar } from 'lucide-react';
import { certificateService } from '../../lib/supabase';
import { useApp } from '../../contexts/AppContext';
import { getCourseImage } from '../../utils/images';
import type { Certificate } from '../../types';

export default function Certificates() {
  const { t, theme, user } = useApp();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    certificateService.getUserCertificates(user.id).then(({ data }) => {
      if (data) setCertificates(data);
      setLoading(false);
    });
  }, [user]);

  return (
    <div className={`p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('certificates.title')}</h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('certificates.subtitle')}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${isDark ? 'border-slate-600' : 'border-slate-300'}`} />
        </div>
      ) : certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Award className={`h-12 w-12 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
          <h3 className={`mt-4 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('certificates.noCertificates')}</h3>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('certificates.completeFirst')}</p>
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className={`rounded-2xl border p-4 text-center shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
              <Award className={`mx-auto h-6 w-6 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
              <p className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{certificates.length}</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('certificates.earned')}</p>
            </div>
            <div className={`rounded-2xl border p-4 text-center shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
              <Calendar className={`mx-auto h-6 w-6 ${isDark ? 'text-accent-400' : 'text-accent-500'}`} />
              <p className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.fullName.split(' ')[0] || ''}</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('certificates.memberSince')}</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert, idx) => (
              <div key={cert.id} className={`group overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-lg ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <div className={`relative p-6 text-white`}>
                  <img src={getCourseImage({ id: cert.courseId })} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
                  <div className="relative text-center">
                    <Award className="mx-auto h-12 w-12" />
                    <h3 className="mt-2 text-sm font-bold">{t('certificates.completionCertificate')}</h3>
                    <div className="mx-auto mt-2 h-px w-16 bg-white/50" />
                    <p className="mt-2 text-lg font-bold">{user?.fullName || ''}</p>
                    <p className="mt-1 text-xs text-white/80">{t('certificates.hasCompleted')}</p>
                  </div>
                  <div className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-white/30" />
                  <div className="absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-white/30" />
                  <div className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-white/30" />
                  <div className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-white/30" />
                </div>
                <div className="p-4">
                  <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{cert.courseTitle}</h3>
                  <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('course.instructor')} : {cert.instructorName || '—'}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`rounded-lg px-2 py-1 text-xs font-semibold ${isDark ? 'bg-success-900/30 text-success-400' : 'bg-success-50 text-success-700'}`}>
                      {t('certificates.grade')} : {cert.grade}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{cert.earnedDate}</span>
                  </div>
                  <div className={`mt-3 flex gap-2 border-t pt-3 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                    <button className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      <Download className="h-3.5 w-3.5" /> {t('certificates.download')}
                    </button>
                    <button className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      <Share2 className="h-3.5 w-3.5" /> {t('course.share')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
