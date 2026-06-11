export type Language = 'fr' | 'en';

export const translations = {
  // Navigation
  'nav.dashboard': {
    fr: 'Tableau de bord',
    en: 'Dashboard',
  },
  'nav.catalog': {
    fr: 'Catalogue',
    en: 'Catalog',
  },
  'nav.myCourses': {
    fr: 'Mes cours',
    en: 'My Courses',
  },
  'nav.certificates': {
    fr: 'Certificats',
    en: 'Certificates',
  },
  'nav.calendar': {
    fr: 'Calendrier',
    en: 'Calendar',
  },
  'nav.forum': {
    fr: 'Forum',
    en: 'Forum',
  },
  'nav.leaderboard': {
    fr: 'Classement',
    en: 'Leaderboard',
  },
  'nav.profile': {
    fr: 'Profil',
    en: 'Profile',
  },
  'nav.settings': {
    fr: 'Parametres',
    en: 'Settings',
  },

  // Common
  'common.search': {
    fr: 'Rechercher un cours, un sujet...',
    en: 'Search for a course, topic...',
  },
  'common.back': {
    fr: 'Retour',
    en: 'Back',
  },
  'common.next': {
    fr: 'Suivant',
    en: 'Next',
  },
  'common.previous': {
    fr: 'Precedent',
    en: 'Previous',
  },
  'common.save': {
    fr: 'Enregistrer',
    en: 'Save',
  },
  'common.cancel': {
    fr: 'Annuler',
    en: 'Cancel',
  },
  'common.loading': {
    fr: 'Chargement...',
    en: 'Loading...',
  },
  'common.error': {
    fr: 'Une erreur est survenue',
    en: 'An error occurred',
  },
  'common.success': {
    fr: 'Succes',
    en: 'Success',
  },
  'common.free': {
    fr: 'Gratuit',
    en: 'Free',
  },
  'common.seeAll': {
    fr: 'Voir tout',
    en: 'See all',
  },
  'common.lessons': {
    fr: 'lecons',
    en: 'lessons',
  },
  'common.students': {
    fr: 'etudiants',
    en: 'students',
  },
  'common.hours': {
    fr: 'heures',
    en: 'hours',
  },
  'common.minutes': {
    fr: 'minutes',
    en: 'minutes',
  },
  'common.days': {
    fr: 'jours',
    en: 'days',
  },
  'common.points': {
    fr: 'points',
    en: 'points',
  },

  // Levels
  'level.beginner': {
    fr: 'Debutant',
    en: 'Beginner',
  },
  'level.intermediate': {
    fr: 'Intermediaire',
    en: 'Intermediate',
  },
  'level.advanced': {
    fr: 'Avance',
    en: 'Advanced',
  },

  // Dashboard
  'dashboard.welcome': {
    fr: 'Bon retour,',
    en: 'Welcome back,',
  },
  'dashboard.streak': {
    fr: 'jours de suite',
    en: 'day streak',
  },
  'dashboard.completedLessons': {
    fr: 'Vous avez complete {count} lecons. Continuez comme ca !',
    en: 'You have completed {count} lessons. Keep it up!',
  },
  'dashboard.resumeCourse': {
    fr: 'Reprendre mon cours',
    en: 'Resume my course',
  },
  'dashboard.coursesInProgress': {
    fr: 'Cours en cours',
    en: 'Courses in progress',
  },
  'dashboard.lessonsCompleted': {
    fr: 'Lecons terminees',
    en: 'Lessons completed',
  },
  'dashboard.certificatesEarned': {
    fr: 'Certificats',
    en: 'Certificates',
  },
  'dashboard.xpPoints': {
    fr: 'Points XP',
    en: 'XP Points',
  },
  'dashboard.continueLearning': {
    fr: 'Continuer l\'apprentissage',
    en: 'Continue Learning',
  },
  'dashboard.weeklyActivity': {
    fr: 'Activite hebdomadaire',
    en: 'Weekly Activity',
  },
  'dashboard.upcomingEvents': {
    fr: 'Prochains evenements',
    en: 'Upcoming Events',
  },
  'dashboard.recommendedForYou': {
    fr: 'Recommande pour vous',
    en: 'Recommended for you',
  },
  'dashboard.thisMonth': {
    fr: 'ce mois',
    en: 'this month',
  },
  'dashboard.total': {
    fr: 'total',
    en: 'total',
  },
  'dashboard.recently': {
    fr: 'recemment',
    en: 'recently',
  },
  'dashboard.top10': {
    fr: 'Top 10%',
    en: 'Top 10%',
  },
  'dashboard.keepItUp': {
    fr: 'Continuez comme ca pour maintenir votre serie.',
    en: 'Keep it up to maintain your streak.',
  },

  // Catalog
  'catalog.title': {
    fr: 'Catalogue des cours',
    en: 'Course Catalog',
  },
  'catalog.subtitle': {
    fr: 'Explorez notre collection de {count} cours de qualite professionnelle.',
    en: 'Explore our collection of {count} professional quality courses.',
  },
  'catalog.filters': {
    fr: 'Filtres',
    en: 'Filters',
  },
  'catalog.sortBy': {
    fr: 'Trier par',
    en: 'Sort by',
  },
  'catalog.mostPopular': {
    fr: 'Plus populaires',
    en: 'Most Popular',
  },
  'catalog.bestRated': {
    fr: 'Mieux notes',
    en: 'Best Rated',
  },
  'catalog.newest': {
    fr: 'Plus recents',
    en: 'Newest',
  },
  'catalog.priceLow': {
    fr: 'Prix croissant',
    en: 'Price: Low to High',
  },
  'catalog.priceHigh': {
    fr: 'Prix decroissant',
    en: 'Price: High to Low',
  },
  'catalog.all': {
    fr: 'Tous',
    en: 'All',
  },
  'catalog.paid': {
    fr: 'Payant',
    en: 'Paid',
  },
  'catalog.coursesFound': {
    fr: 'cours trouve(s)',
    en: 'course(s) found',
  },
  'catalog.noCourses': {
    fr: 'Aucun cours trouve',
    en: 'No courses found',
  },
  'catalog.tryDifferentFilters': {
    fr: 'Essayez de modifier vos filtres ou votre recherche.',
    en: 'Try changing your filters or search query.',
  },
  'catalog.enrolled': {
    fr: 'Inscrit',
    en: 'Enrolled',
  },
  'catalog.progress': {
    fr: 'Progression',
    en: 'Progress',
  },

  // My Courses
  'myCourses.title': {
    fr: 'Mes cours',
    en: 'My Courses',
  },
  'myCourses.subtitle': {
    fr: 'Suivez votre progression et continuez votre apprentissage.',
    en: 'Track your progress and continue learning.',
  },
  'myCourses.overallProgress': {
    fr: 'Progression globale',
    en: 'Overall Progress',
  },
  'myCourses.enrolled': {
    fr: 'Cours inscrits',
    en: 'Enrolled Courses',
  },
  'myCourses.completed': {
    fr: 'Termines',
    en: 'Completed',
  },
  'myCourses.lessonsDone': {
    fr: 'Lecons faites',
    en: 'Lessons Done',
  },
  'myCourses.inProgress': {
    fr: 'En cours',
    en: 'In Progress',
  },
  'myCourses.continue': {
    fr: 'Continuer',
    en: 'Continue',
  },
  'myCourses.review': {
    fr: 'Revoir',
    en: 'Review',
  },
  'myCourses.nextLesson': {
    fr: 'Prochain :',
    en: 'Next:',
  },
  'myCourses.noCourses': {
    fr: 'Aucun cours trouve',
    en: 'No courses found',
  },
  'myCourses.enrollFirst': {
    fr: 'Inscrivez-vous a un cours pour commencer.',
    en: 'Enroll in a course to get started.',
  },
  'myCourses.exploreCatalog': {
    fr: 'Explorer le catalogue',
    en: 'Explore Catalog',
  },

  // Course Detail
  'course.aboutCourse': {
    fr: 'A propos de ce cours',
    en: 'About this course',
  },
  'course.whatYouWillLearn': {
    fr: 'Ce que vous apprendrez',
    en: 'What you will learn',
  },
  'course.content': {
    fr: 'Contenu',
    en: 'Content',
  },
  'course.overview': {
    fr: 'Apercu',
    en: 'Overview',
  },
  'course.reviews': {
    fr: 'Avis',
    en: 'Reviews',
  },
  'course.continueCourse': {
    fr: 'Continuer le cours',
    en: 'Continue Course',
  },
  'course.enrollFree': {
    fr: 'S\'inscrire gratuitement',
    en: 'Enroll for Free',
  },
  'course.buyCourse': {
    fr: 'Acheter ce cours',
    en: 'Buy this Course',
  },
  'course.addToFavorites': {
    fr: 'Ajouter aux favoris',
    en: 'Add to Favorites',
  },
  'course.certificate': {
    fr: 'Certificat de completion',
    en: 'Certificate of Completion',
  },
  'course.unlimitedAccess': {
    fr: 'Acces illimite',
    en: 'Unlimited Access',
  },
  'course.progressTracking': {
    fr: 'Suivi de progression',
    en: 'Progress Tracking',
  },
  'course.share': {
    fr: 'Partager',
    en: 'Share',
  },
  'course.instructor': {
    fr: 'Instructeur',
    en: 'Instructor',
  },
  'course.lessonsCompleted': {
    fr: 'lecons completees',
    en: 'lessons completed',
  },
  'course.tags': {
    fr: 'Tags',
    en: 'Tags',
  },
  'course.notFound': {
    fr: 'Cours non trouve',
    en: 'Course not found',
  },
  'course.backToCatalog': {
    fr: 'Retour au catalogue',
    en: 'Back to Catalog',
  },

  // Lesson
  'lesson.backToCourse': {
    fr: 'Retour au cours',
    en: 'Back to Course',
  },
  'lesson.myNotes': {
    fr: 'Mes notes',
    en: 'My Notes',
  },
  'lesson.takeNotes': {
    fr: 'Prenez des notes pendant la lecon...',
    en: 'Take notes during the lesson...',
  },
  'lesson.markComplete': {
    fr: 'Marquer comme termine',
    en: 'Mark as Complete',
  },
  'lesson.courseContent': {
    fr: 'Contenu du cours',
    en: 'Course Content',
  },
  'lesson.importantPoint': {
    fr: 'Point important',
    en: 'Important Point',
  },

  // Quiz
  'quiz.startQuiz': {
    fr: 'Commencer le quiz',
    en: 'Start Quiz',
  },
  'quiz.questions': {
    fr: 'Questions',
    en: 'Questions',
  },
  'quiz.duration': {
    fr: 'Duree',
    en: 'Duration',
  },
  'quiz.minScore': {
    fr: 'Score min.',
    en: 'Min. Score',
  },
  'quiz.question': {
    fr: 'Question',
    en: 'Question',
  },
  'quiz.of': {
    fr: 'sur',
    en: 'of',
  },
  'quiz.nextQuestion': {
    fr: 'Question suivante',
    en: 'Next Question',
  },
  'quiz.seeResults': {
    fr: 'Voir les resultats',
    en: 'See Results',
  },
  'quiz.explanation': {
    fr: 'Explication',
    en: 'Explanation',
  },
  'quiz.congratulations': {
    fr: 'Felicitations !',
    en: 'Congratulations!',
  },
  'quiz.notYet': {
    fr: 'Pas encore...',
    en: 'Not yet...',
  },
  'quiz.passedMessage': {
    fr: 'Vous avez reussi le quiz avec brio !',
    en: 'You passed the quiz with flying colors!',
  },
  'quiz.failedMessage': {
    fr: 'Vous avez besoin de {score}% pour reussir. Reessayez !',
    en: 'You need {score}% to pass. Try again!',
  },
  'quiz.restart': {
    fr: 'Recommencer',
    en: 'Restart',
  },
  'quiz.quit': {
    fr: 'Quitter',
    en: 'Quit',
  },

  // Certificates
  'certificates.title': {
    fr: 'Mes certificats',
    en: 'My Certificates',
  },
  'certificates.subtitle': {
    fr: 'Vos certificats de reussite obtenus tout au long de votre parcours.',
    en: 'Your certificates of achievement earned throughout your journey.',
  },
  'certificates.earned': {
    fr: 'Certificats obtenus',
    en: 'Certificates Earned',
  },
  'certificates.coursesCompleted': {
    fr: 'Cours termines',
    en: 'Courses Completed',
  },
  'certificates.memberSince': {
    fr: 'Membre depuis',
    en: 'Member Since',
  },
  'certificates.completionCertificate': {
    fr: 'CERTIFICAT DE REUSSITE',
    en: 'CERTIFICATE OF COMPLETION',
  },
  'certificates.hasCompleted': {
    fr: 'a termine avec succes',
    en: 'has successfully completed',
  },
  'certificates.grade': {
    fr: 'Note',
    en: 'Grade',
  },
  'certificates.download': {
    fr: 'Telecharger',
    en: 'Download',
  },
  'certificates.noCertificates': {
    fr: 'Aucun certificat',
    en: 'No Certificates',
  },
  'certificates.completeFirst': {
    fr: 'Terminez un cours pour obtenir votre premier certificat.',
    en: 'Complete a course to earn your first certificate.',
  },

  // Calendar
  'calendar.title': {
    fr: 'Calendrier',
    en: 'Calendar',
  },
  'calendar.subtitle': {
    fr: 'Gerez vos deadlines, sessions live et rappels.',
    en: 'Manage your deadlines, live sessions and reminders.',
  },
  'calendar.month': {
    fr: 'Mois',
    en: 'Month',
  },
  'calendar.list': {
    fr: 'Liste',
    en: 'List',
  },
  'calendar.eventsOnDay': {
    fr: 'Evenements du',
    en: 'Events on',
  },
  'calendar.selectDay': {
    fr: 'Selectionnez un jour',
    en: 'Select a day',
  },
  'calendar.noEvents': {
    fr: 'Aucun evenement',
    en: 'No events',
  },
  'calendar.clickOnDay': {
    fr: 'Cliquez sur un jour',
    en: 'Click on a day',
  },
  'calendar.legend': {
    fr: 'Legende',
    en: 'Legend',
  },
  'calendar.deadline': {
    fr: 'Date limite',
    en: 'Deadline',
  },
  'calendar.live': {
    fr: 'Live',
    en: 'Live',
  },
  'calendar.exam': {
    fr: 'Examen',
    en: 'Exam',
  },
  'calendar.reminder': {
    fr: 'Rappel',
    en: 'Reminder',
  },
  'calendar.noEventsThisMonth': {
    fr: 'Aucun evenement ce mois.',
    en: 'No events this month.',
  },

  // Forum
  'forum.title': {
    fr: 'Forum de discussion',
    en: 'Discussion Forum',
  },
  'forum.subtitle': {
    fr: 'Echangez avec la communaute et obtenez de l\'aide.',
    en: 'Connect with the community and get help.',
  },
  'forum.newDiscussion': {
    fr: 'Nouvelle discussion',
    en: 'New Discussion',
  },
  'forum.allCourses': {
    fr: 'Tous les cours',
    en: 'All Courses',
  },
  'forum.searchDiscussions': {
    fr: 'Rechercher une discussion...',
    en: 'Search discussions...',
  },
  'forum.recent': {
    fr: 'Recent',
    en: 'Recent',
  },
  'forum.popular': {
    fr: 'Populaire',
    en: 'Popular',
  },
  'forum.replies': {
    fr: 'reponses',
    en: 'replies',
  },
  'forum.noDiscussions': {
    fr: 'Aucune discussion',
    en: 'No Discussions',
  },
  'forum.beFirst': {
    fr: 'Soyez le premier a lancer une discussion !',
    en: 'Be the first to start a discussion!',
  },

  // Leaderboard
  'leaderboard.title': {
    fr: 'Classement',
    en: 'Leaderboard',
  },
  'leaderboard.subtitle': {
    fr: 'Comparez vos performances avec les autres apprenants.',
    en: 'Compare your performance with other learners.',
  },
  'leaderboard.yourPosition': {
    fr: 'Votre position',
    en: 'Your Position',
  },
  'leaderboard.places': {
    fr: 'places',
    en: 'places',
  },
  'leaderboard.courses': {
    fr: 'cours',
    en: 'courses',
  },
  'leaderboard.dayStreak': {
    fr: 'jours de serie',
    en: 'day streak',
  },
  'leaderboard.fullRanking': {
    fr: 'Classement complet',
    en: 'Full Ranking',
  },
  'leaderboard.you': {
    fr: '(vous)',
    en: '(you)',
  },

  // Profile
  'profile.profileInfo': {
    fr: 'Informations du profil',
    en: 'Profile Information',
  },
  'profile.editProfile': {
    fr: 'Modifier le profil',
    en: 'Edit Profile',
  },
  'profile.learner': {
    fr: 'Apprenant',
    en: 'Learner',
  },
  'profile.memberSince': {
    fr: 'Membre depuis',
    en: 'Member since',
  },
  'profile.coursesCompleted': {
    fr: 'Cours termines',
    en: 'Courses Completed',
  },
  'profile.dayStreak': {
    fr: 'Jours de serie',
    en: 'Day Streak',
  },
  'profile.skills': {
    fr: 'Competences',
    en: 'Skills',
  },
  'profile.activity30Days': {
    fr: 'Activite (30 derniers jours)',
    en: 'Activity (last 30 days)',
  },
  'profile.lessActive': {
    fr: 'Moins actif',
    en: 'Less active',
  },
  'profile.moreActive': {
    fr: 'Plus actif',
    en: 'More active',
  },
  'profile.badgesEarned': {
    fr: 'Badges obtenus',
    en: 'Badges Earned',
  },
  'profile.coursesInProgress': {
    fr: 'Cours en cours',
    en: 'Courses in Progress',
  },

  // Settings
  'settings.title': {
    fr: 'Parametres',
    en: 'Settings',
  },
  'settings.subtitle': {
    fr: 'Gerez votre compte et vos preferences.',
    en: 'Manage your account and preferences.',
  },
  'settings.profile': {
    fr: 'Profil',
    en: 'Profile',
  },
  'settings.notifications': {
    fr: 'Notifications',
    en: 'Notifications',
  },
  'settings.security': {
    fr: 'Securite',
    en: 'Security',
  },
  'settings.preferences': {
    fr: 'Preferences',
    en: 'Preferences',
  },
  'settings.profilePhoto': {
    fr: 'Photo de profil',
    en: 'Profile Photo',
  },
  'settings.photoFormats': {
    fr: 'JPG, PNG ou GIF. Max 2MB.',
    en: 'JPG, PNG or GIF. Max 2MB.',
  },
  'settings.fullName': {
    fr: 'Nom complet',
    en: 'Full Name',
  },
  'settings.email': {
    fr: 'Email',
    en: 'Email',
  },
  'settings.bio': {
    fr: 'Bio',
    en: 'Bio',
  },
  'settings.emailNotifications': {
    fr: 'Notifications par email',
    en: 'Email Notifications',
  },
  'settings.emailNotificationsDesc': {
    fr: 'Recevez des mises a jour par email.',
    en: 'Receive updates via email.',
  },
  'settings.pushNotifications': {
    fr: 'Notifications push',
    en: 'Push Notifications',
  },
  'settings.pushNotificationsDesc': {
    fr: 'Recevez des notifications dans le navigateur.',
    en: 'Receive browser notifications.',
  },
  'settings.weeklyDigest': {
    fr: 'Resume hebdomadaire',
    en: 'Weekly Digest',
  },
  'settings.weeklyDigestDesc': {
    fr: 'Recevez un resume de votre progression chaque semaine.',
    en: 'Receive a weekly progress summary.',
  },
  'settings.courseUpdates': {
    fr: 'Mises a jour de cours',
    en: 'Course Updates',
  },
  'settings.courseUpdatesDesc': {
    fr: 'Soyez informe des nouveaux contenus dans vos cours.',
    en: 'Get notified about new content in your courses.',
  },
  'settings.forumReplies': {
    fr: 'Reponses sur le forum',
    en: 'Forum Replies',
  },
  'settings.forumRepliesDesc': {
    fr: 'Soyez notifie quand quelqu\'un repond a vos discussions.',
    en: 'Get notified when someone replies to your discussions.',
  },
  'settings.currentPassword': {
    fr: 'Mot de passe actuel',
    en: 'Current Password',
  },
  'settings.newPassword': {
    fr: 'Nouveau mot de passe',
    en: 'New Password',
  },
  'settings.confirmPassword': {
    fr: 'Confirmer le mot de passe',
    en: 'Confirm Password',
  },
  'settings.twoFactor': {
    fr: 'Authentification a deux facteurs',
    en: 'Two-Factor Authentication',
  },
  'settings.twoFactorDesc': {
    fr: 'Ajoutez une couche de securite supplementaire.',
    en: 'Add an extra layer of security.',
  },
  'settings.language': {
    fr: 'Langue',
    en: 'Language',
  },
  'settings.timezone': {
    fr: 'Fuseau horaire',
    en: 'Timezone',
  },
  'settings.theme': {
    fr: 'Theme',
    en: 'Theme',
  },
  'settings.lightMode': {
    fr: 'Mode clair',
    en: 'Light Mode',
  },
  'settings.darkMode': {
    fr: 'Mode sombre',
    en: 'Dark Mode',
  },
  'settings.saved': {
    fr: 'Enregistre !',
    en: 'Saved!',
  },

  // Sidebar
  'sidebar.streakMessage': {
    fr: 'jours de suite !',
    en: 'day streak!',
  },

  // Categories
  'category.all': {
    fr: 'Tous',
    en: 'All',
  },
  'category.webDev': {
    fr: 'Developpement Web',
    en: 'Web Development',
  },
  'category.dataScience': {
    fr: 'Data Science',
    en: 'Data Science',
  },
  'category.design': {
    fr: 'Design',
    en: 'Design',
  },
  'category.ai': {
    fr: 'Intelligence Artificielle',
    en: 'Artificial Intelligence',
  },
  'category.devops': {
    fr: 'DevOps',
    en: 'DevOps',
  },
  'category.cybersecurity': {
    fr: 'Cybersecurite',
    en: 'Cybersecurity',
  },
  'category.mobile': {
    fr: 'Mobile',
    en: 'Mobile',
  },

  // Months
  'month.january': { fr: 'Janvier', en: 'January' },
  'month.february': { fr: 'Fevrier', en: 'February' },
  'month.march': { fr: 'Mars', en: 'March' },
  'month.april': { fr: 'Avril', en: 'April' },
  'month.may': { fr: 'Mai', en: 'May' },
  'month.june': { fr: 'Juin', en: 'June' },
  'month.july': { fr: 'Juillet', en: 'July' },
  'month.august': { fr: 'Aout', en: 'August' },
  'month.september': { fr: 'Septembre', en: 'September' },
  'month.october': { fr: 'Octobre', en: 'October' },
  'month.november': { fr: 'Novembre', en: 'November' },
  'month.december': { fr: 'Decembre', en: 'December' },

  // Days
  'day.mon': { fr: 'Lun', en: 'Mon' },
  'day.tue': { fr: 'Mar', en: 'Tue' },
  'day.wed': { fr: 'Mer', en: 'Wed' },
  'day.thu': { fr: 'Jeu', en: 'Thu' },
  'day.fri': { fr: 'Ven', en: 'Fri' },
  'day.sat': { fr: 'Sam', en: 'Sat' },
  'day.sun': { fr: 'Dim', en: 'Sun' },

  // Auth
  'auth.signIn': {
    fr: 'Se connecter',
    en: 'Sign In',
  },
  'auth.signUp': {
    fr: 'S\'inscrire',
    en: 'Sign Up',
  },
  'auth.signOut': {
    fr: 'Se deconnecter',
    en: 'Sign Out',
  },
  'auth.email': {
    fr: 'Email',
    en: 'Email',
  },
  'auth.password': {
    fr: 'Mot de passe',
    en: 'Password',
  },
  'auth.forgotPassword': {
    fr: 'Mot de passe oublie ?',
    en: 'Forgot password?',
  },
  'auth.noAccount': {
    fr: 'Pas de compte ?',
    en: 'No account?',
  },
  'auth.hasAccount': {
    fr: 'Deja un compte ?',
    en: 'Already have an account?',
  },
} as const;

export type TranslationKey = keyof typeof translations;
