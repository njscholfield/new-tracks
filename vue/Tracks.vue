<template>
  <div>
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
          <tr v-for="track in tracks">
            <td><router-link :to="track.trackID">{{ track.title }}</router-link></td>
            <td>{{ track.artist }}</td>
            <td class="text-center">{{ track.releaseDate | moment('LL') }}</td>
            <td class="text-center"><span class="edit" @click="editTrack(track)"><font-awesome-icon icon="pencil-alt"></font-awesome-icon></span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-md-none">
      <div v-for="track in tracks">
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
    <pre v-if="showJSON"><code>{{ tracks }}</code></pre>
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
        submitInfo: {}
      }
    },
    props: ['user'],
    components: { EditTrackModal },
    computed: {
      numTracks() {
        return this.tracks.length;
      },
      favTracks() {
        return this.tracks.filter((item) => item.isFavorite)
      },
      favTrackNum() {
        return this.favTracks.length;
      }
    },
    methods: {
      getTracks() {
        fetch(`/api/${this.user.username}`, {credentials: 'include'})
          .then(blob => blob.json())
          .then(data => this.tracks = data.tracks)
          .then(() => this.$emit('track-num', this.numTracks, this.favTrackNum))
          .catch(response => console.log('Error fetching tracks: ', response));
      },
      receiveTracks(trackArray) {
        this.tracks = trackArray;
        this.$emit('track-num', this.numTracks, this.favTrackNum);
      },
      toggleJSON() {
        this.showJSON = !this.showJSON;
      },
      editTrack(track) {
        this.submitInfo = track;
        this.$refs.editTrack.showModal();
      }
    },
    mounted() {
      this.getTracks();
    }
  }
</script>

<style scoped>
  td .fa-pencil-alt {
    color: var(--primary);
  }
  td .fa-pencil-alt:hover {
    color: var(--info);
  }
</style>