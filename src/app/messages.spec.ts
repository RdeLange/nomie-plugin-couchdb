import { describe, expect, it } from 'vitest';
import { EN, MESSAGES } from './messages';

describe('the translations', () => {
  it('have every key in every language', () => {
    const keys = Object.keys(EN).sort();
    for (const [lang, messages] of Object.entries(MESSAGES)) {
      expect(Object.keys(messages).sort(), lang).toEqual(keys);
    }
  });

  it('have no empty text', () => {
    for (const [lang, messages] of Object.entries(MESSAGES)) {
      for (const [key, text] of Object.entries(messages)) {
        expect(text.trim(), `${lang}.${key}`).not.toBe('');
      }
    }
  });

  it('keep the licence in English', () => {
    for (const messages of Object.values(MESSAGES)) {
      expect(messages.licenceText).toBe(EN.licenceText);
    }
  });
});
