<script>
    import { createEventDispatcher } from 'svelte';
    import {
      Button,
      Content,
        Grid,
        Row,
        Column,
        TextInput,
    } from "carbon-components-svelte";
   
    export let pluginname;
    export let pluginemoji;
    export let plugin;
    export let emailaddress;

    var email = emailaddress;
    var couchdbserviceurl = "https://couchdbadmin.dailynomie.com";

   let open=true;
   
   const dispatch = createEventDispatcher();

   function exitMain(){
        dispatch("exitinfo");
        open = false;
    }

    async function register() {
      fetch(couchdbserviceurl+"/register", {
  method: "POST",
  body: JSON.stringify({
    email: "ronald_de_lange@hotmail.com"
  }),
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }
})
  .then((response) => response.json())
  .then((json) => {
    plugin.alert('CouchDB Plugin Message', json.message);
    plugin.storage.setItem('emailaddress',email);
    console.log(json)});

    }


    function unregister() {
      fetch(couchdbserviceurl+"/unregister", {
  method: "POST",
  body: JSON.stringify({
    email: "ronald_de_lange@hotmail.com"
  }),
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }
})
  .then((response) => response.json())
  .then((json) => {
    plugin.alert('CouchDB Plugin Message', json.message);
    plugin.storage.setItem('emailaddress',email);
    console.log(json)});

    }
    
</script>

<Content>
    <Grid>
      <Row>
        <Column>
          <h1 style="text-align:center">{pluginemoji}</h1>
          <h2 style="text-align:center">{pluginname}</h2>
          <h5 style="text-align:center">Loaded Succesfully</h5>
          <hr>
          <h5 style="text-align:center">This Plugin will let you Register for the free CouchDB Sync Service from DailyNomie. It's usage is very simple: provide your email address and click on the Register button. You will receive your credentials in your email.</h5>
          <h5 style="text-align:center">In case you would like to Un-Register, please use the Un-Register button.</h5>
          <h5 style="text-align:center">In case you forgot your credentials, please first Un-Register. Then Register again.</h5>
          <h5 style="text-align:center">I am providing this service on best effort because I would like many people to be able to enjoy Nomie. Be patience with me in case of errors or bugs🥴</h5>
          <hr>
        </Column>
      </Row>
      <Row>
        <Column>
          <br>
          <span><TextInput size="xl" hideLabel labelText="email" placeholder="Email address..." bind:value={email} /></span>
          <br>
        </Column>
        </Row>
        <Row>
        <Column>
            <br>
             <span><Button on:click={register} style="float: right;">Register</Button></span>
             <br>
        </Column>
      <Column>
          <br>
           <span><Button on:click={unregister} style="float: left;">Un-Register</Button></span>
           <br>
      </Column>
  </Row>
    </Grid>
  </Content>



  <style>
    h2 {
       margin: 0;
       padding: 0;
       font-size: 2.5em;
       font-weight: 400;
   }




 </style>

