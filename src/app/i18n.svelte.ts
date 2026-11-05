// The language the plugin shows. It changes when Nomie sends the language (registered, prefsChanged).
import { MESSAGES, type Messages } from './messages';
import type { Lang } from './prefs';

export const ui = $state<{ lang: Lang }>({ lang: 'en' });

export const setLang = (lang: Lang) => {
  ui.lang = lang;
};

// The text for a key in the current language
export const t = (key: keyof Messages): string => MESSAGES[ui.lang][key];
