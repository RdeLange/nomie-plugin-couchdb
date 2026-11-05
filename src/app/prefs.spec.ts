import { describe, expect, it } from 'vitest';
import {
  DAILYNOMIE_PALETTE,
  LEGACY_PALETTE,
  ROLES,
  cssVariables,
  fontScaleFrom,
  isDailyNomie7,
  langFrom,
  legacyThemeFor,
  lookFrom,
  modeFrom,
  nextLegacyTheme,
} from './prefs';

// What Daily Nomie 7 sends (prefs.colours from src/style/plugin-colours.ts, prefs.fontScale, the language)
const dailyNomie7Prefs = (mode: 'light' | 'dark', extra: Record<string, unknown> = {}) => ({
  theme: mode,
  language: 'de',
  fontScale: 1.25,
  colours: { mode, current: DAILYNOMIE_PALETTE[mode] },
  ...extra,
});

// What Nomie 6.8 sends: the theme and the language, and no colours or text size
const nomie6Prefs = (theme: string, language = 'en-us') => ({ theme, language });

describe('which app the plugin runs in', () => {
  it('recognises Daily Nomie 7 by its colours', () => {
    expect(isDailyNomie7(dailyNomie7Prefs('light'))).toBe(true);
  });

  it('treats Nomie 6.8 (no colours) as the older app', () => {
    expect(isDailyNomie7(nomie6Prefs('light'))).toBe(false);
    expect(isDailyNomie7(undefined)).toBe(false);
  });
});

describe('the look in Daily Nomie 7', () => {
  it('uses the colours the app sends, for the theme in use', () => {
    const look = lookFrom(dailyNomie7Prefs('dark'), null);
    expect(look.generation).toBe('dailynomie7');
    expect(look.mode).toBe('dark');
    expect(look.palette).toEqual(DAILYNOMIE_PALETTE.dark);
    expect(look.legacyTheme).toBeNull();
  });

  it('keeps the app colour for each role it sends, and the plugin colour for a role it does not', () => {
    const prefs = { colours: { mode: 'light', current: { tint: '#123456' } } };
    const look = lookFrom(prefs, null);
    expect(look.palette.tint).toBe('#123456');
    expect(look.palette.page).toBe(DAILYNOMIE_PALETTE.light.page);
  });

  it('applies the text size the app sends', () => {
    expect(lookFrom(dailyNomie7Prefs('light'), null).fontScale).toBe(1.25);
    expect(cssVariables(lookFrom(dailyNomie7Prefs('light'), null))['--text-scale']).toBe('1.25');
  });

  it('gets the language the app is in', () => {
    expect(lookFrom(dailyNomie7Prefs('light'), null).lang).toBe('de');
  });
});

describe('the look in Nomie 6.8', () => {
  it('starts with the light Carbon theme (g10) and the dark one (g90) in dark mode', () => {
    expect(lookFrom(nomie6Prefs('light'), null).legacyTheme).toBe('g10');
    expect(lookFrom(nomie6Prefs('dark'), null).legacyTheme).toBe('g90');
    expect(legacyThemeFor('dark')).toBe('g90');
  });

  it('uses the Carbon palette of the theme chosen, not the Daily Nomie 7 one', () => {
    const look = lookFrom(nomie6Prefs('dark'), 'g100');
    expect(look.generation).toBe('nomie6');
    expect(look.palette).toEqual(LEGACY_PALETTE.g100);
    expect(look.palette).not.toEqual(DAILYNOMIE_PALETTE.dark);
  });

  it('keeps the text at its normal size, as it has no text size setting', () => {
    expect(lookFrom(nomie6Prefs('light'), null).fontScale).toBe(1);
  });

  it('steps through the themes in the order version 1 used', () => {
    expect(nextLegacyTheme('white')).toBe('g10');
    expect(nextLegacyTheme('g10')).toBe('g80');
    expect(nextLegacyTheme('g80')).toBe('g90');
    expect(nextLegacyTheme('g90')).toBe('g100');
    expect(nextLegacyTheme('g100')).toBe('white');
  });

  it('follows the system for the auto theme', () => {
    expect(modeFrom(nomie6Prefs('auto'), true)).toBe('dark');
    expect(modeFrom(nomie6Prefs('auto'), false)).toBe('light');
  });
});

describe('the palettes', () => {
  it('give every role a colour in both Daily Nomie 7 themes and every Nomie 6.8 theme', () => {
    for (const palette of [...Object.values(DAILYNOMIE_PALETTE), ...Object.values(LEGACY_PALETTE)]) {
      for (const role of ROLES) {
        expect(palette[role], role).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    }
  });

  it('writes one CSS variable per role', () => {
    const variables = cssVariables(lookFrom(dailyNomie7Prefs('light'), null));
    expect(Object.keys(variables)).toHaveLength(ROLES.length + 1);
    expect(variables['--tint']).toBe(DAILYNOMIE_PALETTE.light.tint);
  });
});

describe('the language', () => {
  it('uses the language the app sends, and English for one the plugin does not translate', () => {
    expect(langFrom('it')).toBe('it');
    expect(langFrom('de')).toBe('de');
    expect(langFrom('nl')).toBe('nl');
    expect(langFrom('en-us')).toBe('en');
    expect(langFrom('fr')).toBe('en');
    expect(langFrom(undefined)).toBe('en');
  });
});

describe('the text size', () => {
  it('is the multiplier the app sends, or normal size', () => {
    expect(fontScaleFrom(1.5)).toBe(1.5);
    expect(fontScaleFrom(0)).toBe(1);
    expect(fontScaleFrom(undefined)).toBe(1);
  });
});
