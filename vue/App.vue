<template>
  <div>
    <navbar :user="user"></navbar>
    <url-input @update="updateData"></url-input>
    <b-container>
      <navpills v-model="currentPanel" :num-tracks="numTracks" :num-fav="favTracks" :user="user"></navpills>
      <description v-show="isCurrentPanel(1)" :raw-data="trackData" :user="user" @update="passTracks"></description>
      <tracks ref="tracks" v-if="user.loggedIn" v-show="isCurrentPanel(2)" :user="user" @track-num="updateCounts" @update="passTracks"></tracks>
    </b-container>    
  </div>
</template>

<script>
  import navbar from './Navbar.vue';
  import urlInput from './urlInput.vue';
  import navpills from './Navpills.vue';
  import description from './Description.vue';
  import tracks from './Tracks.vue';
  
  export default {
    data() {
      return { 
        trackData: null,
        currentPanel: 1,
        user: {},
        numTracks: 0,
        favTracks: 0,
      };
    },
    components: { navbar, urlInput, navpills, description, tracks },
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
      },
      updateCounts(numTracks, favTracks) {
        this.numTracks = numTracks;
        this.favTracks = favTracks;
      },
      passTracks(tracksArray) {
        this.$refs.tracks.receiveTracks(tracksArray);
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