<template>
  <div id="top">
    <navbar :user="user"></navbar>
    <url-input @update="updateData"></url-input>
    <div class="container">
      <navpills v-model="currentPanel" :num-tracks="numTracks" :user="user"></navpills>
      <description v-show="isCurrentPanel(1)" :raw-data="trackData" :user="user" :saved-ids="savedIDs" @update="passTracks" @error="handleAxiosError"></description>
      <tracks ref="tracks" v-if="user.loggedIn" v-show="isCurrentPanel(2) || isCurrentPanel(3)" :user="user" :show-favs="showFavs" @tracks="updateCounts" @update="passTracks" @error="handleAxiosError"></tracks>
    </div>  
    <button class="btn btn-primary d-md-none" v-show="!nearTop" id="btn-scroll" @click="scrollToTop"><font-awesome-icon icon="chevron-up"></font-awesome-icon></button> 
    <resume v-if="user.loggedIn" :is-visible="showResume" :user="user"></resume>
    <loading v-show="isLoading"></loading>
    <error ref="errorModal" :error="errorMessage"></error>
  </div>
</template>

<script>
  import navbar from './Navbar.vue';
  import urlInput from './urlInput.vue';
  import navpills from './Navpills.vue';
  import description from './Description.vue';
  import tracks from './Tracks.vue';
  import resume from './Resume.vue';
  import loading from './Loading.vue';
  import error from './ErrorModal.vue';
  
  export default {
    data() {
      return { 
        trackData: {},
        currentPanel: 1,
        user: {},
        numTracks: { all: 0, favorites: 0 },
        savedIDs: [],
        isLoading: false,
        nearTop: true,
        errorMessage: {}
      };
    },
    computed: {
      showFavs() {
        return this.isCurrentPanel(3);
      },
      currentTrack() {
        if(!this.trackData) return undefined;
        return this.trackData.id;
      },
      showResume() {
        return this.currentTrack != this.user.resumeTrack && this.nearTop;
      }
    },
    components: { navbar, urlInput, navpills, description, tracks, resume, loading, error },
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
        this.axios('/auth/verify', {credentials: 'same-origin'})
          .then(response => this.user = response.data)
          .catch(() => this.user.loggedIn = false);
      },
      updateCounts(numTracks, favTracks, trackIDs) {
        this.numTracks.all = numTracks;
        this.numTracks.favorites = favTracks;
        this.savedIDs = trackIDs;
      },
      passTracks(tracksArray) {
        this.$refs.tracks.receiveTracks(tracksArray);
      },
      scrollToTop() {
        document.getElementById('top').scrollIntoView(true);
      },
      handleSCError(error) {
        if(error.response) {
          if(error.response.status === 403) {
            this.updateData({ error: 'The information for this track is not available' });
          } else {
            this.updateData({ error: 'Invalid URL, please try again' });
          }
        } else {
          this.updateData({ error: 'Error loading track info, check your connection!'});
        }
      },
      handleAxiosError(title, message) {
        this.checkLogin();
        this.errorMessage = { title: title, message: message.response.data.message };
        this.$refs.errorModal.showModal();
      },
      updateResumeTrack() {
        if(!this.user.loggedIn) return;
        const postData = { currentTrack: this.currentTrack };
        this.axios.post(`/api/${this.user.username}/current`, postData, {credentials: 'same-origin'})
          .catch(() => this.checkLogin());
      },
      handleScroll() {
        if(this.nearTop !== (document.scrollingElement.scrollTop < 200)) {
          this.nearTop = Boolean(document.scrollingElement.scrollTop < 200);
        }
      }
    },
    mounted() {
      this.checkLogin();
    },
    created() {
      window.addEventListener('scroll', this.handleScroll);
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    watch: {
      '$route': { immediate: true, handler() {
        const track = this.$route.path.substring(1);
        if((isNaN(track) && !track.includes('soundcloud')) || track == '') return;
        const url = ['https://api.soundcloud.com/', undefined, 'client_id=30cba84d4693746b0a2fbc0649b2e42c'];
        url[1] = (track.includes('soundcloud')) ? `resolve.json?url=${track}/&` : `tracks/${track}/?`;
        this.isLoading = true;
        this.axios(url.join(''))
          .then(response => this.updateData(response.data))
          .then(() => this.updateResumeTrack())
          .catch(this.handleSCError)
          .finally(() => this.isLoading = false);
      }
      },
      'currentPanel': function(newValue) {
        if(newValue == 2 || newValue == 3) {
          window.setTimeout(() => this.$refs.tracks.scrollToId(this.currentTrack), 400);
        }
      }
    }
  };
</script>

<style>
  #btn-scroll {
    position: fixed;
    bottom: 3rem;
    right: 1rem;
    padding: .25rem .75rem .5rem .75rem;
  }
  @media (max-width: 500px) {
  /* Prevent fields from zooming in on mobile */
  .form-control:focus, .form-control:hover {
    font-size: 1.1em;
  }
  input[type=date] {
    min-height: 2.5rem;
  }
}
</style>