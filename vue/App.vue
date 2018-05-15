<template>
  <div>
    <navbar :user="user"></navbar>
    <url-input @update="updateData"></url-input>
    <b-container>
      <navpills v-model="currentPanel" :num-tracks="numTracks" :user="user"></navpills>
      <description v-show="isCurrentPanel(1)" :raw-data="trackData" :user="user" :saved-ids="savedIDs" @update="passTracks"></description>
      <tracks ref="tracks" v-if="user.loggedIn" v-show="isCurrentPanel(2) || isCurrentPanel(3)" :user="user" :show-favs="showFavs" @tracks="updateCounts" @update="passTracks"></tracks>
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
        numTracks: { all: 0, favorites: 0 },
        savedIDs: []
      };
    },
    computed: {
      showFavs() {
        return this.isCurrentPanel(3);
      }
    },
    components: { navbar, urlInput, navpills, description, tracks },
    methods: {
      updateData(newData) {
        this.trackData = newData;
        const path = (newData.id) ? `/${newData.id}` : '/';
        this.$router.replace(path);
        this.updatePanel(1);
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
      updateCounts(numTracks, favTracks, trackIDs) {
        this.numTracks.all = numTracks;
        this.numTracks.favorites = favTracks;
        this.savedIDs = trackIDs;
      },
      passTracks(tracksArray) {
        this.$refs.tracks.receiveTracks(tracksArray);
      }
    },
    mounted() {
      this.checkLogin();
    },
    watch: {
      '$route': { immediate: true,
      handler(to, from) {
        const track = this.$route.path.substring(1);
        if((isNaN(track) && !track.includes('soundcloud')) || track == '') return;
        const url = ['https://api.soundcloud.com/', undefined, 'client_id=30cba84d4693746b0a2fbc0649b2e42c']
        url[1] = (track.includes('soundcloud')) ? `resolve.json?url=${track}/&` : `tracks/${track}/?`;
        fetch(url.join(''))
          .then(response => {
            if(!response.ok) {
              if(response.status === 403) {
                return { error: 'The information for this track is not available' };
              } else {
                return { error: 'Invalid track URL' };
              }
            } else {
              return response.json();
            }
          })
          .then(data => this.updateData(data))
          .catch(response => console.log(response));
        }
      }
    }
  }
</script>