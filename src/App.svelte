<script lang="ts">
  import { onMount } from 'svelte';
  import { syncCall, type SyncAction } from './sync/server';
  import { lookFrom, cssVariables, legacyThemeFor, nextLegacyTheme, modeFrom, langFrom, type LegacyTheme } from './app/prefs';
  import { t, setLang } from './app/i18n.svelte';
  import Icon from './app/Icon.svelte';

  // The calls this plugin makes to Nomie; Nomie refuses any other
  const USES = ['getStorageItem', 'setStorageItem', 'alert', 'confirm'];
  // The key the email address is kept under. Version 1 used the same key, so the address is kept on upgrade.
  const EMAIL_KEY = 'emailaddress';

  let tab = $state<'sync' | 'about'>('sync');
  let prefs = $state<Record<string, unknown>>({});
  let legacyTheme = $state<LegacyTheme | null>(null);
  let systemDark = $state(false);
  let inNomie = $state(false);
  let email = $state('');
  let busy = $state(false);
  let notice = $state('');

  const look = $derived(lookFrom(prefs, legacyTheme, systemDark));

  // The colours and the text size go on the document, so the whole page (also outside the column) takes them
  $effect(() => {
    const root = document.documentElement;
    for (const [name, value] of Object.entries(cssVariables(look))) root.style.setProperty(name, value);
  });

  let plugin: any;

  // Takes the preferences the app sent. On Nomie 6.8 the theme starts from the mode of the app (as version 1 did), and
  // starts again when that mode changes. The header button can change the theme in between.
  const takePrefs = (user: unknown) => {
    if (!user || typeof user !== 'object') return;
    const mode = modeFrom(user, systemDark);
    if (legacyTheme === null || mode !== look.mode) legacyTheme = legacyThemeFor(mode);
    prefs = user as Record<string, unknown>;
    setLang(langFrom((user as { language?: unknown }).language));
  };

  // Inside Nomie a message is shown in a Nomie alert; outside it (the dev server) it is shown on the page
  const tell = (message: string) => {
    if (inNomie) plugin.alert(t('alertTitle'), message);
    else notice = message;
  };

  const sync = async (action: SyncAction) => {
    const address = email.trim();
    if (!address) {
      tell(t('enterEmail'));
      return;
    }
    if (action === 'unregister' && inNomie) {
      const reply = await plugin.confirm(t('optOutTitle'), t('optOutMessage'));
      if (reply?.value !== true) return;
    }
    busy = true;
    notice = '';
    try {
      const message = await syncCall(action, address);
      // the address is kept once the service has answered, as version 1 did
      if (inNomie) await plugin.storage.setItem(EMAIL_KEY, address);
      tell(message);
    } catch {
      tell(t('unreachable'));
    } finally {
      busy = false;
    }
  };

  onMount(() => {
    const dark = window.matchMedia?.('(prefers-color-scheme: dark)');
    systemDark = !!dark?.matches;
    dark?.addEventListener?.('change', (event) => (systemDark = event.matches));

    // Nomie tells the plugin when the theme, the colours, the text size or the language change while it is open
    window.addEventListener('message', (event) => {
      if (event.source !== window.parent) return;
      const message = event.data as { action?: unknown; data?: { user?: unknown } } | undefined;
      if (message?.action === 'prefsChanged') takePrefs(message.data?.user);
    });

    // Outside Nomie there is no plugin: the page shows the light look and the sync is not available
    if (typeof NomiePlugin === 'undefined') return;
    inNomie = true;
    plugin = new NomiePlugin({
      name: 'Nomie Sync',
      emoji: '🔄',
      description: 'Sync your data between devices.',
      uses: USES,
      version: '2.0',
      addToCaptureMenu: true,
      addToMoreMenu: true,
      addToWidgets: false,
    });
    plugin.onRegistered(async () => {
      takePrefs(plugin.prefs);
      await plugin.storage.init();
      const stored = plugin.storage.getItem(EMAIL_KEY);
      email = typeof stored === 'string' ? stored : '';
    });
    plugin.onUIOpened(() => {
      takePrefs(plugin.prefs);
      tab = 'sync';
    });
  });
</script>

<main class="page" data-generation={look.generation} data-mode={look.mode}>
  <header class="top">
  <div class="action-row">
    {#if look.generation === 'nomie6'}
      <button
        class="round"
        aria-label={t('theme')}
        title={t('theme')}
        onclick={() => (legacyTheme = nextLegacyTheme(look.legacyTheme ?? 'g10'))}
      >
        <Icon name="theme" size={18} />
      </button>
    {/if}
  </div>

  <h1 class="large-title">{t('title')}</h1>
  <p class="subtitle">{t('subtitle')}</p>

  <div class="segmented" role="tablist">
    <button role="tab" aria-selected={tab === 'sync'} class:on={tab === 'sync'} onclick={() => (tab = 'sync')}>
      <Icon name="sync" size={16} />
      {t('tabSync')}
    </button>
    <button role="tab" aria-selected={tab === 'about'} class:on={tab === 'about'} onclick={() => (tab = 'about')}>
      <Icon name="info" size={16} />
      {t('tabAbout')}
    </button>
  </div>
  </header>

  {#if notice}
    <p class="notice" role="status">{notice}</p>
  {/if}

  {#if tab === 'sync'}
    <p class="section">{t('account')}</p>
    <div class="card">
      <label class="field">
        <span class="sr-only">{t('emailLabel')}</span>
        <input type="email" autocomplete="email" inputmode="email" placeholder={t('emailPlaceholder')} bind:value={email} />
      </label>
      <button class="primary" disabled={busy} onclick={() => sync('register')}>{busy ? t('busy') : t('optIn')}</button>
      <button class="destructive" disabled={busy} onclick={() => sync('unregister')}>{t('optOut')}</button>
    </div>

    <p class="section">{t('howItWorks')}</p>
    <div class="card body">
      <p>{t('howOne')}</p>
      <p>{t('howTwo')}</p>
      <p>{t('howThree')}</p>
      <p>{t('howFour')}</p>
      <p>{t('bestEffort')}</p>
    </div>

    {#if !inNomie}
      <p class="footnote">{t('offline')}</p>
    {/if}
  {:else}
    <p class="section">{t('general')}</p>
    <div class="card body">
      <p>{t('generalText')}</p>
    </div>

    <p class="section">{t('licence')}</p>
    <div class="card body">
      <p class="small">{t('licenceText')}</p>
    </div>

    <p class="section">{t('support')}</p>
    <div class="card body">
      <p>{t('supportText')}</p>
    </div>
  {/if}
</main>

<style>
  .page {
    min-height: 100vh;
    max-width: 640px;
    margin: 0 auto;
    padding: 0 16px calc(env(safe-area-inset-bottom) + 24px);
    background: var(--page);
    color: var(--text);
    font-family: var(--font);
  }

  /* the header is a Liquid Glass bar (D-glass) on Daily Nomie 7; on Nomie 6.8 it is the flat page colour */
  .top {
    position: sticky;
    top: 0;
    z-index: 2;
    margin: 0 -16px;
    padding: calc(env(safe-area-inset-top) + 8px) 16px 10px;
    background: var(--glass-fill);
    -webkit-backdrop-filter: var(--glass-blur);
    backdrop-filter: var(--glass-blur);
    border-bottom: 1px solid var(--glass-edge);
  }

  .action-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-height: 44px;
  }

  .round {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 18px;
    background: var(--fill);
    color: var(--text);
    cursor: pointer;
  }

  .large-title {
    margin: 0;
    font-size: calc(34px * var(--text-scale));
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: 0.37px;
  }

  .subtitle {
    margin: 4px 0 16px;
    font-size: calc(15px * var(--text-scale));
    line-height: 1.33;
    color: var(--text-2);
  }

  .segmented {
    display: flex;
    gap: 2px;
    padding: 2px;
    border-radius: 9px;
    background: var(--fill);
  }

  .segmented button {
    flex: 1;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: 0;
    border-radius: 7px;
    background: transparent;
    color: var(--text-2);
    font-family: inherit;
    font-size: calc(15px * var(--text-scale));
    font-weight: 500;
    cursor: pointer;
  }

  .segmented button.on {
    background: var(--card);
    color: var(--text);
    font-weight: 600;
  }

  .section {
    margin: 20px 0 7px;
    font-size: calc(13px * var(--text-scale));
    line-height: 1.38;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: var(--text-2);
  }

  .card {
    padding: 16px;
    border-radius: 12px;
    background: var(--card);
  }

  .card.body p {
    margin: 0 0 12px;
    font-size: calc(15px * var(--text-scale));
    line-height: 1.33;
    color: var(--text);
  }

  .card.body p:last-child {
    margin-bottom: 0;
  }

  .card.body p.small {
    font-size: calc(12px * var(--text-scale));
    line-height: 1.33;
    color: var(--text-2);
  }

  .field {
    display: block;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  input {
    width: 100%;
    min-height: 44px;
    padding: 10px 12px;
    border: 0;
    border-radius: 10px;
    background: var(--card-inner);
    color: var(--text);
    font-family: inherit;
    font-size: calc(17px * var(--text-scale));
    -webkit-appearance: none;
    appearance: none;
  }

  input::placeholder {
    color: var(--text-2);
  }

  .primary,
  .destructive {
    display: block;
    width: 100%;
    min-height: 44px;
    border: 0;
    border-radius: 12px;
    font-family: inherit;
    font-size: calc(17px * var(--text-scale));
    cursor: pointer;
  }

  .primary {
    margin-top: 12px;
    background: var(--tint);
    color: var(--on-tint);
    font-weight: 600;
  }

  .destructive {
    margin-top: 4px;
    background: transparent;
    color: var(--danger);
  }

  button:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .notice {
    margin: 12px 0 0;
    padding: 12px 16px;
    border-radius: 12px;
    background: var(--tint-soft);
    color: var(--tint-text);
    font-size: calc(15px * var(--text-scale));
    line-height: 1.33;
  }

  .footnote {
    margin: 12px 0 0;
    font-size: calc(13px * var(--text-scale));
    line-height: 1.38;
    color: var(--text-2);
  }
</style>
