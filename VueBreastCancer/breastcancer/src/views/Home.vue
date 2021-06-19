<template>

  
  <div>
    <button v-on:click="OpenModal()">Bookings</button>
    <div id="example-2">
  <button v-on:click="say('hi')">Say Hi</button>
  <button v-on:click="say('what')">Say What</button>
</div>
  </div>
  
 

</template>

<script>
// import func from 'vue-editor-bridge';
import UserService from '../services/user.service';

export default {
  name: 'Home',
  data() {
    return {
      content: ''
    };
  },
  mounted() {
    UserService.getPublicContent().then(
      response => {
        this.content = response.data;
      },
      error => {
        this.content =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  },
  // methods(){
  //   OpenModal: function() {
  //     console.log("dasdasd")
  //   }
   methods: {
    say: function (msg) {
      alert(msg)
    }
  }


    
  
};

</script>