<template>
  <div class="container-fluid">
    <label for="search" class="sr-only">Search your saved tracks</label>
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">
          <font-awesome-icon icon="search"></font-awesome-icon>
        </span>
      </div>
      <input id="search" class="form-control has-feedback" v-model="searchTerm">
      <div class="input-group-append">
        <button class="form-control-feedback" aria-hidden="true" type="reset" @click="searchTerm = ''"><font-awesome-icon icon="times"></font-awesome-icon></button>
      </div>
    </div>
    <ul v-if="filteredTracks.length" class="grid-container">
      <li class="track-box" :class="{'active': isCurrentTrack(track.trackID)}" v-for="track in filteredTracks" :key="track.trackID" :id="track.trackID">
        <h3 v-if="isCurrentTrack(track.trackID)" title="This track is already selected, view it in the Description tab">{{ track.title }}</h3>
        <h3 v-else><router-link :to="track.trackID">{{ track.title }}</router-link></h3>
        <h5>{{ track.artist }}</h5>
        <p>{{ track.releaseDate | moment('LL') }}</p>
        <button class="btn btn-sm btn-primary" @click="editTrack(track)"><span><font-awesome-icon icon="pencil-alt"/></span> Edit Info</button>
      </li>
    </ul>
    <h4 class="text-info mt-3" v-else>No results</h4>
    <edit-track-modal ref="editTrack" :track-info="submitInfo" :user="user"></edit-track-modal>
  </div>
</template>

<script>
  import EditTrackModal from './EditTrackModal.vue';

  export default {
    data() {
      return {
        tracks: [],
        submitInfo: {},
        searchTerm: ''
      };
    },
    props: ['user', 'showFavs', 'currentId'],
    components: { EditTrackModal },
    computed: {
      numTracks() {
        return this.tracks.length;
      },
      favTracks() {
        return this.tracks.filter((item) => item.isFavorite);
      },
      favTrackNum() {
        return this.favTracks.length;
      },
      filteredTracks() {
        const lcSearchTerm = this.searchTerm.toLowerCase();
        const tracks = (this.showFavs) ? this.favTracks : this.tracks;
        return tracks.filter((track) => {
          return track.title.toLowerCase().includes(lcSearchTerm) || track.artist.toLowerCase().includes(lcSearchTerm);
        });
      },
      trackIDs() {
        return this.tracks.map((item) => item.trackID);
      }
    },
    methods: {
      getTracks() {
        this.axios(`/api/${this.user.username}`, {credentials: 'same-origin'})
          .then(response => this.tracks = response.data.tracks)
          .then(() => this.$emit('tracks', this.numTracks, this.favTrackNum, this.trackIDs))
          .catch(response => this.$emit('error', 'Error loading tracks', response));
      },
      receiveTracks(trackArray) {
        this.tracks = trackArray;
        this.$emit('tracks', this.numTracks, this.favTrackNum, this.trackIDs);
      },
      editTrack(track) {
        this.submitInfo = track;
        this.$refs.editTrack.showModal();
      },
      scrollToId(trackID) {
        document.getElementById(trackID).scrollIntoView(true);
      },
      isCurrentTrack(id) {
        return (this.currentId == id);
      }
    },
    mounted() {
      this.getTracks();
    }
  };
</script>

<style scoped lang="scss">
  td .fa-pencil-alt {
    color: var(--primary);
  }
  td .fa-pencil-alt:hover {
    color: var(--info);
  }
  .form-control-feedback {
    background-color: transparent;
    border: none;
    margin-left: -1.5rem;
    z-index: 10;
  }
  .grid-container {
    padding: 1rem 0;
    list-style: none;
  }
  .track-box {
    box-shadow: 0 0 2px;
    padding: 1rem;
    height: 100%;
    margin-bottom: 1rem;
    &.active {
      background-color: var(--indigo);
      color: #cecece;
      h3 {
        color: white
      }
    }
  }
  .dark-mode .track-box.bg-info {
    opacity: .8;
  }
  @supports(display: grid) {
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      grid-gap: 1rem;
    }
    .track-box {
      margin-bottom: 0;
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto 1fr auto;
      h3 {
        font-size: 1.3rem;
      }
      p {
        font-weight: 300;
      }
      h3, h5, p {
        grid-column: span 2;
      }
      button {
        grid-column: 1 / 2;
      }
    }
  }
</style>
