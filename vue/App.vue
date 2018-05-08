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
        user: {}
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
      },
      checkLogin() {
        fetch('/auth/verify/', {credentials: 'include'})
          .then(blob => blob.json())
          .then(data => this.user = data)
          .catch(response => console.log('Error checking login status', response));
      }
    },
    mounted() {
      this.checkLogin();
    },
    watch: {
      '$route' (to, from) {
        fetch(`https://api.soundcloud.com/tracks/${this.$route.params.track}?client_id=30cba84d4693746b0a2fbc0649b2e42c`)
          .then(blob => blob.json())
          .then(data => {
            this.updateData(data);
            this.updatePanel(1);
          })
          .catch(response => console.log('Error fetching track info', response));
      }
    }
  }
</script>