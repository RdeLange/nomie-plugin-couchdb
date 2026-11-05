// The look of the plugin, from the preferences Nomie sends it.
//
// Daily Nomie 7 sends prefs.colours (the palette of each theme, the same values as its src/style/plugin-colours.ts),
// prefs.fontScale and the language. Nomie 6.8 sends only the theme and the language. On 6.8 the plugin keeps the look
// it had in version 1: the Carbon themes (white, g10, g80, g90, g100), with a theme button in the header.
export type Mode = 'light' | 'dark';
export type Lang = 'en' | 'it' | 'de' | 'nl';
export type LegacyTheme = 'white' | 'g10' | 'g80' | 'g90' | 'g100';
export type Generation = 'dailynomie7' | 'nomie6';

// The colour roles, the same as DailyNomie 7's PluginPalette
export const ROLES = [
  'page',
  'card',
  'cardInner',
  'text',
  'textSecondary',
  'separator',
  'fill',
  'tint',
  'onTint',
  'tintSoft',
  'good',
  'goodSoft',
  'danger',
  'onDanger',
  'switchOn',
  'switchOff',
] as const;
export type Role = (typeof ROLES)[number];
export type Palette = Record<Role, string>;

// The CSS variable each role is drawn with
const VARIABLE: Record<Role, string> = {
  page: '--page',
  card: '--card',
  cardInner: '--card-inner',
  text: '--text',
  textSecondary: '--text-2',
  separator: '--separator',
  fill: '--fill',
  tint: '--tint',
  onTint: '--on-tint',
  tintSoft: '--tint-soft',
  good: '--good',
  goodSoft: '--good-soft',
  danger: '--danger',
  onDanger: '--on-danger',
  switchOn: '--switch-on',
  switchOff: '--switch-off',
};

// DailyNomie 7's PLUGIN_PALETTE (src/style/plugin-colours.ts). Used when the app sends no colours.
export const DAILYNOMIE_PALETTE: Record<Mode, Palette> = {
  light: {
    page: '#F2F2F7',
    card: '#FFFFFF',
    cardInner: '#F2F2F7',
    text: '#000000',
    textSecondary: '#636368',
    separator: '#D8D8DC',
    fill: '#E5E5EA',
    tint: '#0A6CC9',
    onTint: '#FFFFFF',
    tintSoft: '#EBF4FD',
    good: '#1E7A34',
    goodSoft: '#DDF3E2',
    danger: '#D70015',
    onDanger: '#FFFFFF',
    switchOn: '#34C759',
    switchOff: '#E3E3E8',
  },
  dark: {
    page: '#000000',
    card: '#1C1C1E',
    cardInner: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#AEAEB2',
    separator: '#48484A',
    fill: '#2C2C2E',
    tint: '#4DB3FF',
    onTint: '#000000',
    tintSoft: '#0B2236',
    good: '#30D158',
    goodSoft: '#123620',
    danger: '#FF6961',
    onDanger: '#000000',
    switchOn: '#34C759',
    switchOff: '#39393D',
  },
};

// The Carbon themes Nomie 6.8 used through version 1 of this plugin. Carbon's colour tokens, mapped to the roles.
export const LEGACY_PALETTE: Record<LegacyTheme, Palette> = {
  white: {
    page: '#ffffff',
    card: '#f4f4f4',
    cardInner: '#ffffff',
    text: '#161616',
    textSecondary: '#525252',
    separator: '#e0e0e0',
    fill: '#e0e0e0',
    tint: '#0f62fe',
    onTint: '#ffffff',
    tintSoft: '#d0e2ff',
    good: '#198038',
    goodSoft: '#a7f0ba',
    danger: '#da1e28',
    onDanger: '#ffffff',
    switchOn: '#0f62fe',
    switchOff: '#8d8d8d',
  },
  g10: {
    page: '#f4f4f4',
    card: '#ffffff',
    cardInner: '#f4f4f4',
    text: '#161616',
    textSecondary: '#525252',
    separator: '#e0e0e0',
    fill: '#e0e0e0',
    tint: '#0f62fe',
    onTint: '#ffffff',
    tintSoft: '#d0e2ff',
    good: '#198038',
    goodSoft: '#a7f0ba',
    danger: '#da1e28',
    onDanger: '#ffffff',
    switchOn: '#0f62fe',
    switchOff: '#8d8d8d',
  },
  g80: {
    page: '#393939',
    card: '#525252',
    cardInner: '#393939',
    text: '#f4f4f4',
    textSecondary: '#c6c6c6',
    separator: '#6f6f6f',
    fill: '#6f6f6f',
    tint: '#78a9ff',
    onTint: '#161616',
    tintSoft: '#001d6c',
    good: '#6fdc8c',
    goodSoft: '#044317',
    danger: '#ff8389',
    onDanger: '#161616',
    switchOn: '#78a9ff',
    switchOff: '#6f6f6f',
  },
  g90: {
    page: '#262626',
    card: '#393939',
    cardInner: '#262626',
    text: '#f4f4f4',
    textSecondary: '#c6c6c6',
    separator: '#525252',
    fill: '#525252',
    tint: '#78a9ff',
    onTint: '#161616',
    tintSoft: '#001d6c',
    good: '#6fdc8c',
    goodSoft: '#044317',
    danger: '#ff8389',
    onDanger: '#161616',
    switchOn: '#78a9ff',
    switchOff: '#6f6f6f',
  },
  g100: {
    page: '#161616',
    card: '#262626',
    cardInner: '#393939',
    text: '#f4f4f4',
    textSecondary: '#c6c6c6',
    separator: '#393939',
    fill: '#393939',
    tint: '#78a9ff',
    onTint: '#161616',
    tintSoft: '#001d6c',
    good: '#6fdc8c',
    goodSoft: '#044317',
    danger: '#ff8389',
    onDanger: '#161616',
    switchOn: '#78a9ff',
    switchOff: '#6f6f6f',
  },
};

const LEGACY_ORDER: LegacyTheme[] = ['white', 'g10', 'g80', 'g90', 'g100'];

// The Nomie 6.8 theme a mode starts with (version 1: light is g10, dark is g90)
export const legacyThemeFor = (mode: Mode): LegacyTheme => (mode === 'dark' ? 'g90' : 'g10');

// The header button steps through the themes in the order version 1 used
export const nextLegacyTheme = (theme: LegacyTheme): LegacyTheme => LEGACY_ORDER[(LEGACY_ORDER.indexOf(theme) + 1) % LEGACY_ORDER.length];

// Daily Nomie 7 sends the palette in prefs.colours; Nomie 6.8 does not
export const isDailyNomie7 = (prefs: unknown): boolean => {
  const colours = (prefs as { colours?: { current?: unknown } } | null)?.colours;
  return !!colours?.current && typeof colours.current === 'object';
};

// light or dark. 'auto' (Nomie 6.8) follows the system, as the app does.
export const modeFrom = (prefs: unknown, systemDark = false): Mode => {
  const p = (prefs ?? {}) as { colours?: { mode?: unknown }; theme?: unknown };
  const value = p.colours?.mode ?? p.theme;
  if (value === 'dark') return 'dark';
  if (value === 'auto') return systemDark ? 'dark' : 'light';
  return 'light';
};

// The app's language. Anything the plugin does not translate is English.
export const langFrom = (value: unknown): Lang => {
  const code = typeof value === 'string' ? value.toLowerCase() : '';
  if (code.startsWith('it')) return 'it';
  if (code.startsWith('de')) return 'de';
  if (code.startsWith('nl')) return 'nl';
  return 'en';
};

// The text size multiplier (fontScale, from level 1 to 5). Nomie 6.8 sends none, so the text is at its normal size.
export const fontScaleFrom = (value: unknown): number => (typeof value === 'number' && value > 0 ? value : 1);

export type Look = {
  generation: Generation;
  mode: Mode;
  lang: Lang;
  fontScale: number;
  palette: Palette;
  // the Nomie 6.8 theme in use (null on Daily Nomie 7, which follows the app's theme)
  legacyTheme: LegacyTheme | null;
};

// The look for the preferences the app sent. `legacy` is the Nomie 6.8 theme the header button has chosen.
export const lookFrom = (prefs: unknown, legacy: LegacyTheme | null, systemDark = false): Look => {
  const mode = modeFrom(prefs, systemDark);
  const lang = langFrom((prefs as { language?: unknown } | null)?.language);
  if (isDailyNomie7(prefs)) {
    const current = (prefs as { colours: { current: Partial<Palette> } }).colours.current;
    const palette = { ...DAILYNOMIE_PALETTE[mode] };
    for (const role of ROLES) {
      const value = current[role];
      if (typeof value === 'string' && value !== '') palette[role] = value;
    }
    return { generation: 'dailynomie7', mode, lang, fontScale: fontScaleFrom((prefs as { fontScale?: unknown }).fontScale), palette, legacyTheme: null };
  }
  const theme = legacy ?? legacyThemeFor(mode);
  return { generation: 'nomie6', mode, lang, fontScale: 1, palette: LEGACY_PALETTE[theme], legacyTheme: theme };
};

// The CSS variables of a look, for the plugin's root element
export const cssVariables = (look: Look): Record<string, string> => {
  const variables: Record<string, string> = { '--text-scale': String(look.fontScale) };
  for (const role of ROLES) variables[VARIABLE[role]] = look.palette[role];
  return variables;
};
