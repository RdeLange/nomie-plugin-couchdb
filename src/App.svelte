<script>
  import { onMount } from 'svelte';
  import "carbon-components-svelte/css/all.css";
  import {
    Header,
    HeaderUtilities,
    HeaderGlobalAction,
    SkipToContent,
    Content,
    Grid,
    Row,
    Column,
    Theme,
    Button,
  } from "carbon-components-svelte";
  import Main from "./pages/main.svelte";
  import Info from "./pages/info.svelte";
  import Settings from "./pages/settings.svelte";
  import SettingsAdjust from "carbon-icons-svelte/lib/SettingsAdjust.svelte";
  import Sun from "carbon-icons-svelte/lib/Sun.svelte";
  import Information from "carbon-icons-svelte/lib/Information.svelte";

  const pluginname = "Plugin Sync";
  const pluginemoji = "🔄";
  var emailaddress = "";
  
  const plugin = new NomiePlugin({
        name: pluginname,
        emoji: pluginemoji,
        description: "Nomie Sync Service",
        uses: [],
        version: "1.0",
        addToCaptureMenu: true,
        addToMoreMenu: true,
        addToWidgets: true,
      }); 
  let inNomie = false;
  let theme = "g10";
  let mode = "hidden";
  let loading = true;
  let view = "main";

  // Load init params
  function loadInitParams() {
    plugin.onUIOpened(async () => {
      mode = 'modal';
    });

    plugin.onWidget(() => {
      if (plugin.prefs.theme == "light") {
        theme = "white"}
      else if (plugin.prefs.theme == "dark") {
        theme = "g100"}  
      else {theme = "g10"} 
      mode = "widget";
    });

    plugin.onRegistered(async () => {
      await plugin.storage.init()
      emailaddress = plugin.storage.getItem('emailaddress') || "";
      if (plugin.prefs.theme == "light") {
        theme = "g10"}
      else if (plugin.prefs.theme == "dark") {
        theme = "g90"}  
      else {theme = "g10"} 
    })

  setTimeout(() => {
      inNomie = true;
      loading = false;
    }, 700);
  }

  // change theme
  function toggleTheme(){
    console.log(theme);
    if (theme == "white"){
      theme = "g10"}
    else if (theme == "g10"){
      theme = "g80"}
    else if (theme == "g80"){
      theme = "g90"}
    else if (theme == "g90"){
      theme = "g100"}
    else {
      theme = "white"}
 }

  

//view main page
function showMain(){
  view = "main"
  window.scrollTo(0,0);
 }
 
 //view info page
 function showInformation(){
  view = "info"
  window.scrollTo(0,0);
 }

 //view settings page
 function showSettings(){
  view = "settings"
  window.scrollTo(0,0);
 }

 function saveSettings(){
  showMain();
 }

 onMount(async () => {
  loadInitParams();
 })

</script>

{#if mode == "modal"  || mode =="widget"}
<Theme bind:theme />
{#if inNomie}
{#if mode == "modal"}
<Header company={"Nomie6"} platformName={pluginname} on:click={showMain}>
  <svelte:fragment slot="skip-to-content">
    <SkipToContent />
  </svelte:fragment>
  <HeaderUtilities>
    <HeaderGlobalAction aria-label="Settings" icon={SettingsAdjust} on:click={showSettings}/>
    <HeaderGlobalAction aria-label="Theme" icon={Sun} on:click={toggleTheme}/>
    <HeaderGlobalAction aria-label="Theme" icon={Information} on:click={showInformation}/>
  </HeaderUtilities>
</Header>

{#if view == "main"}
<Main pluginname={pluginname} pluginemoji={pluginemoji} plugin={plugin} emailaddress={emailaddress}/>
{:else if view == "info"}
<Info parent={"Nomie6"} pluginname={pluginname} pluginemoji={pluginemoji} on:exitinfo={showMain}/>
{:else if view == "settings"}
<Settings pluginname={pluginname} pluginemoji={pluginemoji} on:exitsettings={showMain} on:savesettings={saveSettings}/>
{/if}
{:else if mode == "widget"}
<p>Widget Placeholder</p>
{/if}
{/if}

{:else if !inNomie}
        <h1 style="text-align:center">{pluginemoji}</h1>
        <h2 style="text-align:center">{pluginname}</h2>
        <h5 style="text-align:center">This is a plugin for Nomie</h5>
        <hr>
{/if}
{#if loading}
<div class="startup">
<p>Loading....</p>
</div>
{/if}
