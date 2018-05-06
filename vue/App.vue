<template>
  <div>
    <navbar :user="user"></navbar>
    <url-input @update="updateData"></url-input>
    <b-container>
      <navpills v-model="currentPanel" num-tracks="100" num-fav="50" :user="user"></navpills>
      <description v-show="isCurrentPanel(1)" :raw-data="trackData" :user="user"></description>
    </b-container>
  </div>
</template>

<script>
  import navbar from './Navbar.vue';
  import urlInput from './urlInput.vue';
  import navpills from './Navpills.vue';
  import description from './Description.vue';
  
  export default {
    data() {
      return { 
        trackData: null,
        currentPanel: 1,
        user: {
          username: 'njscholfield',
          loggedIn: true
        }
      };
    },
    components: { navbar, urlInput, navpills, description },
    methods: {
      updateData(newData) {
        this.trackData = newData;
      },
      updatePanel(id) {
        this.currentPanel = id;
      },
      isCurrentPanel(id) {
        return this.currentPanel == id;
      }
    }
  }
</script>