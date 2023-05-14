<script>
    import { createEventDispatcher } from 'svelte';
    import {
      Button,
      Content,
        Grid,
        Row,
        Column,
    } from "carbon-components-svelte";
   
    export let pluginname;
    export let pluginemoji;

   let open=true;
   
   const dispatch = createEventDispatcher();

   function exitSettings(){
        dispatch("exitsettings");
        open = false;
    }

    function saveSettings(){
        dispatch("savesettings");
        dispatch("exitsettings");
        open = false;
    } 
</script>

<Content>
    <Grid>
      <Row>
        <Column>
          <h1 style="text-align:center">{pluginemoji}</h1>
          <h2 style="text-align:center">{pluginname}</h2>
          <h5 style="text-align:center">Plugin Settings</h5>
          <hr>
        </Column>
      </Row>
    </Grid>
    <Row>
      <Column>
          <br>
          <h3 style="text-align:center">This Plugin does not have additional settings.</h3>
           <br>
      </Column>
    
</Row>
  </Content>



  <style>
    h2 {
       margin: 0;
       padding: 0;
       font-size: 2.5em;
       font-weight: 400;
   }

 </style>

