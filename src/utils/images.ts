const CATEGORY_IMAGES: Record<string, string> = {
  développement: '/images/course-dev.jpg',
  design: '/images/course-design.jpg',
  marketing: '/images/course-marketing.jpg',
  business: '/images/course-business.jpg',
  musique: '/images/course-music.jpg',
  langues: '/images/course-language.jpg',
};

export function getCourseImage(course?: { category?: string; thumbnail?: string; id?: string }): string {
  if (course?.thumbnail) return course.thumbnail;
  if (course?.category) {
    const cat = course.category.toLowerCase();
    for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
      if (cat.includes(key)) return url;
    }
  }
  return '/images/course-generic.jpg';
}

const HERO_AUTH = '/images/hero-auth.jpg';
const HERO_DASHBOARD = '/images/hero-dashboard.jpg';

export function getRandomHero(index?: number): string {
  return index === 1 ? HERO_DASHBOARD : HERO_AUTH;
}

export function getProfileCover(): string {
  return '/images/profile-cover.jpg';
}

export function getAvatarUrl(name?: string, size = 80): string {
  const initials = (name || 'U')
    .split(' ')
    .map(n => n.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#3b82f6"/><text x="${size / 2}" y="${size / 2}" text-anchor="middle" dominant-baseline="central" fill="white" font-size="${size * 0.35}" font-weight="600" font-family="system-ui, sans-serif">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function getLessonImage(): string {
  return '/images/lesson-bg.jpg';
}

export function getCategoryImageUrl(category: string): string {
  const cat = category.toLowerCase();
  for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
    if (cat.includes(key)) return url;
  }
  return '/images/course-generic.jpg';
}
