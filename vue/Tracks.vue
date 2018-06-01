<template>
  <div>
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">
          <font-awesome-icon icon="search"></font-awesome-icon>
        </span>
      </div>
      <input class="form-control has-feedback" v-model="searchTerm">
      <div class="input-group-append">
        <button class="form-control-feedback" aria-hidden="true" type="reset" @click="searchTerm = ''"><font-awesome-icon icon="times"></font-awesome-icon></button>
      </div>
    </div>
    <br>
    <div class="d-none d-md-block">
      <table class="table">
        <thead>
          <tr>
            <th>Track Name</th>
            <th>Artist</th>
            <th class="text-center">Release Date</th>
            <th class="text-center">Edit</th>
          </tr>
        </thead>
        <tbody>
          <!-- using the same id for both -->
          <tr v-for="track in filteredTracks" :key="track.trackID" :class="track.trackID">
            <td><router-link :to="track.trackID">{{ track.title }}</router-link></td>
            <td>{{ track.artist }}</td>
            <td class="text-center">{{ track.releaseDate | moment('LL') }}</td>
            <td class="text-center"><span class="edit" @click="editTrack(track)"><font-awesome-icon icon="pencil-alt"></font-awesome-icon></span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-md-none">
      <div v-for="track in filteredTracks" :key="track.trackID" :class="track.trackID">
        <div>
          <h3><router-link :to="track.trackID">{{ track.title }}</router-link></h3>
          <h5>{{ track.artist }}</h5>
          <h6>{{ track.releaseDate | moment('LL') }}</h6>
          <button class="btn btn-sm btn-primary" @click="editTrack(track)"><span><font-awesome-icon icon="pencil-alt"/></span> Edit Info</button>
          <hr>
        </div>
      </div>
      <h4 class="text-info" v-show="numTracks == 0">No results</h4>
    </div>
    <button class="btn btn-link" @click="toggleJSON">View JSON</button>
    <pre v-if="showJSON"><code>{{ filteredTracks }}</code></pre>
    <edit-track-modal ref="editTrack" :track-info="submitInfo" :user="user"></edit-track-modal>
  </div>
</template>

<script>
  import EditTrackModal from './EditTrackModal.vue';

  export default {
    data() {
      return {
        tracks: [],
        showJSON: false,
        submitInfo: {},
        searchTerm: ''
      };
    },
    props: ['user', 'showFavs'],
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
        fetch(`/api/${this.user.username}`, {credentials: 'include'})
          .then(blob => blob.json())
          .then(data => this.tracks = data.tracks)
          .then(() => this.$emit('tracks', this.numTracks, this.favTrackNum, this.trackIDs))
          .catch(response => console.log('Error fetching tracks: ', response));
      },
      receiveTracks(trackArray) {
        this.tracks = trackArray;
        this.$emit('tracks', this.numTracks, this.favTrackNum, this.trackIDs);
      },
      toggleJSON() {
        this.showJSON = !this.showJSON;
      },
      editTrack(track) {
        this.submitInfo = track;
        this.$refs.editTrack.showModal();
      },
      scrollToId(trackID) {
        const els = [...document.getElementsByClassName(trackID)];
        const el = (!els || !els[0]) ? undefined : (els[0].offsetParent !== null) ? els[0] : els[1];
        if(el) el.scrollIntoView(true);
      }
    },
    mounted() {
      this.getTracks();
    }
  };
</script>

<style scoped>
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
</style>