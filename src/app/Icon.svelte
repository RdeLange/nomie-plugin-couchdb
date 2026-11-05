<svelte:options runes={true} />

<script lang="ts">
  // Outline icons from DailyNomie 7's icon set (src/n-icons): the same 512 grid and 32 px stroke
  const { name, size = 22 }: { name: 'sync' | 'info' | 'theme'; size?: number } = $props();
</script>

<svg height="{size}px" width="{size}px" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
  {#if name === 'sync'}
    <path d="M320 146s24.36-12-64-12a160 160 0 10160 160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="32" />
    <path d="M256 58l80 80-80 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
  {:else if name === 'info'}
    <path d="M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184 184-82.39 184-184S349.61 64 248 64z" fill="none" stroke="currentColor" stroke-width="32" />
    <path d="M220 220h32v116" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
    <path d="M208 340h88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="32" />
    <path d="M248 130a26 26 0 1026 26 26 26 0 00-26-26z" fill="currentColor" />
  {:else}
    <circle cx="256" cy="256" r="184" fill="none" stroke="currentColor" stroke-width="32" />
    <path d="M256 72a184 184 0 010 368z" fill="currentColor" />
  {/if}
</svg>
