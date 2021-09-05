<template>
  <div id="top" :class="{ 'dark-mode': darkMode }">
    <navbar :user="user" :mode="darkMode" @darkMode="toggleDarkMode" @random="randomTrack"></navbar>
    <url-input @update="updateData"></url-input>
    <navpills v-model="currentPanel" :num-tracks="numTracks" :user="user"></navpills>
    <description v-show="isCurrentPanel(1)" :raw-data="trackData" :user="user" :saved-ids="savedIDs" @update="passTracks" @error="handleAxiosError"></description>
    <tracks ref="tracks" v-if="user.loggedIn" v-show="isCurrentPanel(2) || isCurrentPanel(3)" :user="user" :show-favs="showFavs" :current-id="currentTrack" @tracks="updateCounts" @update="passTracks" @error="handleAxiosError"></tracks>
    <button class="btn btn-primary" id="btn-scroll" @click="scroll" :title="nearTop ? 'Scroll to bottom' : 'Scroll to top'"><font-awesome-icon :icon="nearTop ? 'chevron-down' : 'chevron-up'" aria-hidden="true"></font-awesome-icon></button>
    <resume v-if="user.loggedIn" :is-visible="showResume" :user="user"></resume>
    <loading v-show="isLoading"></loading>
    <error ref="errorModal" :error="errorMessage"></error>
    <div id="bottom"></div>
  </div>
</template>

<script>
  import navbar from './Navbar.vue';
  import urlInput from './UrlInput.vue';
  import navpills from './NavPills.vue';
  import description from './Description.vue';
  import tracks from './Tracks.vue';
  import resume from './Resume.vue';
  import loading from './Loading.vue';
  import error from './ErrorMessageModal.vue';

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
        errorMessage: {},
        darkMode: false,
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
        if(path !== this.$router.currentRoute.path) {
          this.$router.replace(path);
        }
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
      scroll() {
        const id = this.nearTop ? 'bottom' : 'top';
        document.getElementById(id).scrollIntoView(true);
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
      },
      checkDarkMode() {
        const modeStr = localStorage.getItem('darkMode'); // null if no setting is stored
        this.darkMode = (modeStr === 'true'); // convert localStorage string to boolean
        if(modeStr === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          this.darkMode = true;
        }
      },
      toggleDarkMode() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode);
      },
      randomTrack() {
        const randomID = Math.floor((Math.random() * this.savedIDs.length));
        this.$router.push(this.savedIDs[randomID]);
      }
    },
    mounted() {
      this.checkLogin();
      this.checkDarkMode();
    },
    created() {
      window.addEventListener('scroll', this.handleScroll);
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    watch: {
      '$route': { immediate: true, handler() {
        const track = this.$route.path.substring(1).trim();
        if((isNaN(track) && !track.includes('soundcloud')) || track == '' || track == this.currentTrack) return;
        let url = 'https://api.soundcloud.com/';
        url += (track.includes('soundcloud')) ? `resolve.json?url=${track}` : `tracks/${track}/`;
        this.isLoading = true;

        if(track.includes('soundcloud')) {
          // Safari doesn't send headers with redirects for some reason so proxy through server
          this.axios(`/soundcloud/resolve?url=${track}`)
            .then(response => this.updateData(response.data))
            .then(() => this.updateResumeTrack())
            .catch((err) => this.handleSCError(err))
            .finally(() => this.isLoading = false);
        } else {
          if(!this.user.token) {
            // Wait 1 sec for /auth/verify to finish so token is available
            window.setTimeout(() => {
              this.axios(url, { headers: {'Authorization': `Bearer ${this.user.token}`} })
                .then(response => this.updateData(response.data))
                .then(() => this.updateResumeTrack())
                .catch((err) => this.handleSCError(err))
                .finally(() => this.isLoading = false);
            }, 1000);
          } else {
            this.axios(url, { headers: {'Authorization': `Bearer ${this.user.token}`} })
              .then(response => this.updateData(response.data))
              .then(() => this.updateResumeTrack())
              .catch((err) => this.handleSCError(err))
              .finally(() => this.isLoading = false);
          }
        } 
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

<style lang="scss">
  :root {
    --background: white;
    --text: #222;
    --gradient: linear-gradient(to right, #4BC0C8, #C779D0, #FEAC5E);
  }
  body {
    margin-bottom: 3.3rem;
    margin-bottom: calc(env(safe-area-inset-bottom) + 3.3rem);
  }
  /* Dark Mode */
  #top.dark-mode {
    --background: #333;
    --text: white;
    --gradient: linear-gradient(to right, #c0392b, #8e44ad);
    min-height: 100vh;

    .form-control:focus {
      background: #999;
      color: white;
    }

    .table {
      color: var(--text);
    }
  }

  #top {
    background-color: var(--background);
    color: var(--text);
  }
  #btn-scroll {
    position: fixed;
    bottom: 6rem;
    bottom: calc(env(safe-area-inset-bottom) + 6rem);
    right: 1rem;
    padding: .4rem .75rem .4rem .75rem;
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
