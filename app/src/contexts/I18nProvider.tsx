import type { FC, ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'en' | 'nb';

type Dict = Record<string, string>;

const en: Dict = {
  'nav.dashboard': 'Dashboard',
  'nav.applications': 'Applications',
  'nav.tasks': 'Tasks',
  'nav.documents': 'Documents',
  'nav.insights': 'Insights',
  'nav.calendar': 'Calendar',

  'calendar.title': 'Calendar',
  'calendar.legend.interviews': 'Interviews',
  'calendar.legend.deadlines': 'Deadlines',
  'calendar.legend.todo': 'To do',
  'calendar.legend.overdue': 'Overdue',

  'calendar.prev.month': 'Prev month',
  'calendar.prev.week': 'Prev week',
  'calendar.prev.day': 'Prev day',
  'calendar.next.month': 'Next month',
  'calendar.next.week': 'Next week',
  'calendar.next.day': 'Next day',
  'calendar.today': 'Today',
  'calendar.view.month': 'Month',
  'calendar.view.week': 'Week',
  'calendar.view.day': 'Day',
  'calendar.addReminder': '+ Add Reminder',

  'calendar.details.type': 'Type',
  'calendar.details.title': 'Title',
  'calendar.details.when': 'When',
  'calendar.details.next': 'Next Action',
  'calendar.details.app': 'Linked application',
  'calendar.details.notes': 'Notes',
  'calendar.details.close': 'Close',
  'calendar.details.edit': 'Edit',

  'calendar.modal.addTitle': 'Add Reminder',
  'calendar.modal.type': 'Type',
  'calendar.modal.type.interview': 'Interview',
  'calendar.modal.type.deadline': 'Deadline',
  'calendar.modal.type.todo': 'To do',
  'calendar.modal.type.other': 'Other',
  'calendar.modal.linkApp': 'Link Application (optional)',
  'calendar.modal.updateTask': 'Update Existing Task (optional)',
  'calendar.modal.when': 'Date & time',
  'calendar.modal.notes': 'Notes (optional)',
  'calendar.modal.cancel': 'Cancel',
  'calendar.modal.save': 'Save',
};

const nb: Dict = {
  'nav.dashboard': 'Oversikt',
  'nav.applications': 'Søknader',
  'nav.tasks': 'Oppgaver',
  'nav.documents': 'Dokumenter',
  'nav.insights': 'Innsikt',
  'nav.calendar': 'Kalender',

  'calendar.title': 'Kalender',
  'calendar.legend.interviews': 'Intervjuer',
  'calendar.legend.deadlines': 'Frister',
  'calendar.legend.todo': 'Å gjøre',
  'calendar.legend.overdue': 'Forfalt',

  'calendar.prev.month': 'Forrige måned',
  'calendar.prev.week': 'Forrige uke',
  'calendar.prev.day': 'Forrige dag',
  'calendar.next.month': 'Neste måned',
  'calendar.next.week': 'Neste uke',
  'calendar.next.day': 'Neste dag',
  'calendar.today': 'I dag',
  'calendar.view.month': 'Måned',
  'calendar.view.week': 'Uke',
  'calendar.view.day': 'Dag',
  'calendar.addReminder': '+ Legg til påminnelse',

  'calendar.details.type': 'Type',
  'calendar.details.title': 'Tittel',
  'calendar.details.when': 'Når',
  'calendar.details.next': 'Neste handling',
  'calendar.details.app': 'Knyttet søknad',
  'calendar.details.notes': 'Notater',
  'calendar.details.close': 'Lukk',
  'calendar.details.edit': 'Rediger',

  'calendar.modal.addTitle': 'Legg til påminnelse',
  'calendar.modal.type': 'Type',
  'calendar.modal.type.interview': 'Intervju',
  'calendar.modal.type.deadline': 'Frist',
  'calendar.modal.type.todo': 'Å gjøre',
  'calendar.modal.type.other': 'Annet',
  'calendar.modal.linkApp': 'Knytt søknad (valgfritt)',
  'calendar.modal.updateTask': 'Oppdater eksisterende oppgave (valgfritt)',
  'calendar.modal.when': 'Dato og klokkeslett',
  'calendar.modal.notes': 'Notater (valgfritt)',
  'calendar.modal.cancel': 'Avbryt',
  'calendar.modal.save': 'Lagre',
};

const DICTS: Record<Lang, Dict> = { en, nb };

export interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = 'hp-lang';

export const I18nProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === 'en' || stored === 'nb') setLang(stored);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang === 'nb' ? 'nb' : 'en';
    } catch { /* ignore */ }
  }, [lang]);

  const t = useMemo(() => {
    const dict = DICTS[lang];
    return (key: string) => dict[key] ?? key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}; 