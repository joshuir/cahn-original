export const LOCALES = ['en', 'fr', 'pt'] as const
export type Locale = (typeof LOCALES)[number]
export const LOCALE_NAMES: Record<Locale, string> = { en: 'English', fr: 'Français', pt: 'Português' }
export const isLocale = (v: string | undefined): v is Locale => !!v && (LOCALES as readonly string[]).includes(v)

/** Interface strings. Page content itself is translated in the CMS. */
const en = {
  helpline: 'Helpline',
  contact: 'Contact',
  staffLogin: 'Staff login',
  changeLanguage: 'Change language',
  search: 'Search',
  searchSite: 'Search the site',
  donate: 'Donate',
  healthHour: 'Health Hour',
  menu: 'Menu',
  closeMenu: 'Close menu',
  explore: 'Explore',
  skip: 'Skip to content',
  startsIn: 'Starts in',
  liveSat: 'Health Hour · live Saturday 11:00',
  allPartners: 'All current & previous partners',
  playFilm: 'Play film',
  register: 'Register',
  registerHH: 'Register for Health Hour',
  pastSessions: 'Past sessions',
  nowShowing: 'Now showing',
  upcoming: 'Upcoming',
  replay: 'Replay',
  past: 'Past',
  all: 'All',
  comingUp: 'Coming up',
  allEvents: 'All events & campaigns',
  areas: 'Our areas of work',
  bulletin: 'Our weekly e-bulletin',
  bulletinText: 'Health Hour topics, events, jobs and opportunities — every week. Unsubscribe any time.',
  email: 'Email address',
  signUp: 'Sign up',
  consent: 'I agree to receive emails from CAHN and accept the privacy notice.',
  thanksSub: 'Thank you — check your inbox to confirm.',
  cookieEssential: 'Essential only',
  cookieAccept: 'Accept analytics',
  cookiePolicy: 'Cookie policy',
  untilSat: 'until Saturday 11:00 UK',
  sessionsSince: 'sessions since 2020',
  days: 'days', hours: 'hours', mins: 'mins', secs: 'secs',
  dateTBC: 'Date TBC',
  addCal: 'Add to calendar',
  noResults: 'Nothing found',
  results: 'results',
  popular: 'Popular',
  download: 'Download PDF',
  readMore: 'Read more',
  sendMsg: 'Send message',
  name: 'Name',
  fullName: 'Full name',
  message: 'Message',
  submitError: 'Something went wrong. Please try again or call the helpline.',
}
export type Dict = typeof en

const fr: Dict = {
  ...en,
  helpline: 'Assistance', contact: 'Contact', staffLogin: 'Espace équipe', changeLanguage: 'Changer de langue', search: 'Rechercher', searchSite: 'Rechercher sur le site',
  donate: 'Faire un don', menu: 'Menu', closeMenu: 'Fermer le menu', explore: 'Découvrir', skip: 'Aller au contenu', startsIn: 'Commence dans',
  liveSat: 'Health Hour · en direct samedi 11h', allPartners: 'Tous nos partenaires', playFilm: 'Lire la vidéo', register: 'S’inscrire', registerHH: 'S’inscrire à Health Hour',
  pastSessions: 'Sessions passées', nowShowing: 'À l’affiche', upcoming: 'À venir', replay: 'Replay', past: 'Passés', all: 'Tous', comingUp: 'À venir',
  allEvents: 'Tous les événements', areas: 'Nos domaines d’action', bulletin: 'Notre bulletin hebdomadaire',
  bulletinText: 'Thèmes Health Hour, événements, offres d’emploi — chaque semaine. Désinscription à tout moment.', email: 'Adresse e-mail', signUp: 'S’abonner',
  consent: 'J’accepte de recevoir des e-mails de CAHN et la politique de confidentialité.', thanksSub: 'Merci — vérifiez votre boîte de réception.',
  cookieEssential: 'Essentiels uniquement', cookieAccept: 'Accepter l’analyse', cookiePolicy: 'Politique cookies', untilSat: 'avant samedi 11h (Royaume-Uni)',
  sessionsSince: 'sessions depuis 2020', days: 'jours', hours: 'heures', mins: 'min', secs: 'sec', dateTBC: 'Date à confirmer', addCal: 'Ajouter au calendrier',
  noResults: 'Aucun résultat', results: 'résultats', popular: 'Populaire', download: 'Télécharger le PDF', readMore: 'Lire la suite', sendMsg: 'Envoyer',
  name: 'Nom', fullName: 'Nom complet', message: 'Message', submitError: 'Une erreur est survenue. Réessayez ou appelez la ligne d’assistance.',
}

const pt: Dict = {
  ...en,
  helpline: 'Linha de apoio', contact: 'Contacto', staffLogin: 'Área da equipa', changeLanguage: 'Mudar idioma', search: 'Pesquisar', searchSite: 'Pesquisar no site',
  donate: 'Doar', closeMenu: 'Fechar menu', explore: 'Explorar', skip: 'Saltar para o conteúdo', startsIn: 'Começa em', liveSat: 'Health Hour · ao vivo sábado 11h',
  allPartners: 'Todos os parceiros', playFilm: 'Ver vídeo', register: 'Inscrever', registerHH: 'Inscrever no Health Hour', pastSessions: 'Sessões anteriores',
  nowShowing: 'Em destaque', upcoming: 'Próximas', replay: 'Repetição', past: 'Anteriores', all: 'Todos', comingUp: 'Próximos eventos', allEvents: 'Todos os eventos',
  areas: 'As nossas áreas', bulletin: 'Boletim semanal', bulletinText: 'Temas do Health Hour, eventos e oportunidades — todas as semanas.', email: 'Endereço de e-mail',
  signUp: 'Subscrever', consent: 'Aceito receber e-mails da CAHN e a política de privacidade.', thanksSub: 'Obrigado — verifique o seu e-mail.',
  cookieEssential: 'Apenas essenciais', cookieAccept: 'Aceitar análise', cookiePolicy: 'Política de cookies', untilSat: 'até sábado 11h (Reino Unido)',
  sessionsSince: 'sessões desde 2020', days: 'dias', hours: 'horas', mins: 'min', secs: 'seg', dateTBC: 'Data a confirmar', addCal: 'Adicionar ao calendário',
  noResults: 'Sem resultados', results: 'resultados', popular: 'Popular', download: 'Descarregar PDF', readMore: 'Ler mais', sendMsg: 'Enviar',
  name: 'Nome', fullName: 'Nome completo', message: 'Mensagem', submitError: 'Ocorreu um erro. Tente novamente ou ligue para a linha de apoio.',
}

export const dictionaries: Record<Locale, Dict> = { en, fr, pt }
export const t = (locale: string) => dictionaries[isLocale(locale) ? locale : 'en']

/** Prefix an internal path with the active locale. External links pass through. */
export const href = (locale: string, url?: string | null) => {
  if (!url) return `/${locale}`
  if (/^(https?:|mailto:|tel:|#)/.test(url)) return url
  if (/^\/(en|fr|pt)(\/|$)/.test(url)) return url
  return `/${locale}${url === '/' ? '' : url.startsWith('/') ? url : `/${url}`}`
}
