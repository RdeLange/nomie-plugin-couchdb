// The font of the plugin is the standard font of DailyNomie 7: a system stack, so no web font is loaded.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
// --ios-font in DailyNomie 7's src/style/main.css
const DAILYNOMIE_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif";

describe('the font of the plugin', () => {
  it('is the font DailyNomie 7 uses', () => {
    expect(read('src/app/styles.css')).toContain(`--font: ${DAILYNOMIE_FONT};`);
  });

  it('loads no web font of its own', () => {
    expect(read('src/app/styles.css')).not.toMatch(/@import|@font-face|fonts\.googleapis/);
    expect(read('index.html')).not.toMatch(/fonts\.googleapis|fontsource/);
  });

  it('scales every font size with the text size the app sends', () => {
    const sizes = read('src/App.svelte').match(/font-size: [^;]+;/g) ?? [];
    expect(sizes.length).toBeGreaterThan(0);
    for (const size of sizes) {
      expect(size, size).toContain('var(--text-scale)');
    }
  });
});
